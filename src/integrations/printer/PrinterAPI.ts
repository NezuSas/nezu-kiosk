export const sendToPrinter = async (imageBase64: string) => {
    try {
        const requestBody = {
            image: imageBase64,
        };

        console.log("📤 POST http://127.0.0.1:5000/print", requestBody);

        const response = await fetch("http://127.0.0.1:5000/print", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Servidor de impresión respondió con error: ${errorText}`);
        }

        console.log("✅ Impresión exitosa enviada al puente.");
        alert("✅ Recibo enviado a la impresora.");
    } catch (error) {
        console.error("❌ Error en PrinterAPI:", error);
        alert(`❌ Error de conexión con la impresora: ${error instanceof Error ? error.message : 'Servidor no disponible'}. Asegúrate de que el puente de impresión esté corriendo en el puerto 5000.`);
    }
};