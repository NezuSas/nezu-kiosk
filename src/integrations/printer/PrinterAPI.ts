export const sendToPrinter = async (imageBase64: string) => {
    try {
        const requestBody = {
            image: imageBase64,  // Ahora el backend espera "image" en vez de "text"
        };

        console.log("📤 Enviando datos a la impresora:", requestBody); // Verifica en la consola

        const response = await fetch("http://127.0.0.1:5000/print", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`❌ Error al enviar la imagen a la impresora. ${errorText}`);
        }

        console.log("✅ Imagen enviada correctamente.");
    } catch (error) {
        console.error("❌ Error en la API de impresión:", error);
    }
};