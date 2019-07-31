import {Utils} from "./Utils";
import jsPDF from "jspdf";

import {XMLWriter} from "./xml/XMLWriter";
import {Circuit} from "../../models/Circuit";

declare var jsPDF: any; // jsPDF is external library

export const Exporter = (() => {
    return {
        SaveCircuitToFile: function (circuit: Circuit) {
            const fileName = Utils.escapeFileName(circuit.metadata.getName()) + '.circuit';
            const data = XMLWriter.fromLable(circuit).serialize();


            const file = new Blob([data], {type: "text/plain"});
            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                window.navigator.msSaveOrOpenBlob(file, fileName);
            } else { // Others
                const a = document.createElement("a");
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        SaveCircuitToPng: function (canvas: HTMLCanvasElement, projectName: string): void {
            const data = canvas.toDataURL("image/png", 1.0);

            // Get name
            const filename = Utils.escapeFileName(projectName) + ".png";

            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                const file = new Blob([data], {type: "image/png"});
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else { // Others
                const a = document.createElement("a");
                const url = data;
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        SaveCircuitToPDF: function (canvas: HTMLCanvasElement, projectName: string): void {
            const width = canvas.width;
            const height = canvas.height;

            const data = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("l", "px", [width, height]);

            // Get name
            let filename = Utils.escapeFileName(projectName) + ".pdf";

            // Fill background
            pdf.setFillColor("#CCC");
            pdf.rect(0, 0, width, height, "F");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);
        }
    }

})();
