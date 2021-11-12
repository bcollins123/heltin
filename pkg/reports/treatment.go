package reports

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"text/template"

	"github.com/bhidapa/heltin/pkg/pdf"
	"github.com/bhidapa/heltin/pkg/session"
	"github.com/bhidapa/heltin/pkg/treatments"
	"github.com/domonda/go-errs"
	"github.com/domonda/go-sqldb/db"
	"github.com/domonda/go-types/uu"
	"github.com/gorilla/mux"
	"github.com/ungerik/go-fs"
	"github.com/ungerik/go-httpx/httperr"
)

func ForTreatment(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	treatmentIDVar := mux.Vars(r)["id"]
	if treatmentIDVar == "" {
		httperr.New(http.StatusBadRequest, "Missing treatment ID").ServeHTTP(w, r)
		return
	}

	treatmentID, err := uu.IDFromString(treatmentIDVar)
	if err != nil {
		httperr.New(http.StatusBadRequest, err.Error()).ServeHTTP(w, r)
		return
	}

	log, ctx := log.With().
		Ctx(ctx).
		UUID("treatmentID", treatmentID).
		SubLoggerContext(ctx)

	log.Info("Building treatment reports").Log()

	var reportsPDF *fs.MemFile
	err = session.TransactionAsUser(ctx, func(ctx context.Context) error {
		reportsPDF, err = forTreatmentInPDF(ctx, treatmentID)
		return err
	})
	if err != nil {
		httperr.New(http.StatusBadRequest, err.Error()).ServeHTTP(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", reportsPDF.Size()))

	// TODO-db-121121 if "attachment;" is included, the PDF will be downloaded without opening in browser.
	// the benefit of initiating a download immediately is because the treatment file should be stored in
	// the db too and just downloading emphasises that
	w.Header().Set("Content-Disposition", fmt.Sprintf("filename=%q", reportsPDF.Name()))

	_, err = w.Write(reportsPDF.FileData)
	if err != nil {
		log.Error("Problem while writing treatment PDF").Err(err).Log()
	}
}

func forTreatmentInPDF(ctx context.Context, treatmentID uu.ID) (pdfFile *fs.MemFile, err error) {
	defer errs.WrapWithFuncParams(&err, ctx, treatmentID)

	var treatment treatments.Treatment
	err = db.Conn(ctx).QueryRow("select * from public.case_study_treatment where id = $1", treatmentID).
		ScanStruct(&treatment)
	if err != nil {
		return nil, err
	}

	tmplt := template.New("")
	tmplt, err = tmplt.Parse(treatmentReportHTML)
	if err != nil {
		return nil, err
	}

	data := map[string]string{
		"Title": treatment.Title,
		"Note":  treatment.Description.StringOr(""),
		// TODO-db-121121 add rest
	}

	buffer := new(bytes.Buffer)
	err = tmplt.Execute(buffer, data)
	if err != nil {
		return nil, err
	}

	pdfFileBytes, err := pdf.RenderHTML(ctx, buffer.Bytes(), nil, nil)
	if err != nil {
		return nil, err
	}

	return fs.NewMemFile("somehwere.pdf", pdfFileBytes), nil
}
