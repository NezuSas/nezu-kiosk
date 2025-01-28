import { useState } from "react";
import { PRINTER_T20III_VM } from "./PrinterConstants";

const PrinterDetails = () => {
  const [activeTab, setActiveTab] = useState<
    "description" | "features" | "specifications"
  >("description");

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return <p className="p-4">{PRINTER_T20III_VM.description}</p>;
      case "features":
        return (
          <ul className="p-4 list-disc list-inside">
            {PRINTER_T20III_VM.features.map((feature, index) => (
              <li key={index} className="mb-2">
                {feature}
              </li>
            ))}
          </ul>
        );
      case "specifications":
        return (
          <div className="p-4">
            <h3 className="font-bold mb-2">Especificaciones Técnicas</h3>
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(PRINTER_T20III_VM.specifications).map(
                  ([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </td>
                      <td className="py-2">{value}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{PRINTER_T20III_VM.name}</h1>

      <div className="flex mb-4">
        <img
          src={PRINTER_T20III_VM.imageUrl}
          alt={PRINTER_T20III_VM.name}
          className="w-1/2 object-cover rounded-lg mr-4"
        />
        <div className="w-1/2">
          <div className="flex mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === "description"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Descripción
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === "features"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("features")}
            >
              Características
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "specifications"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Especificaciones
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg">{renderContent()}</div>

          <div className="mt-4">
            <p className="font-bold text-xl">
              Precio: ${PRINTER_T20III_VM.price}
            </p>
            <button className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>

      {PRINTER_T20III_VM.videoTutorialUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Tutorial de Configuración</h2>
          <video
            controls
            className="w-full rounded-lg"
            src={PRINTER_T20III_VM.videoTutorialUrl}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      )}
    </div>
  );
};

export default PrinterDetails;