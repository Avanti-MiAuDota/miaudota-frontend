const statusMessages = {
    APROVADA: {
      color: "text-verde-escuro",
      message: "Adoção aprovada! Em breve o abrigo entrará em contato para combinar a entrega do seu novo amigo. 🐾",
    },
    PENDENTE: {
      color: "text-laranja",
      message: "Sua solicitação está em análise. Aguarde o contato do abrigo para mais informações.",
    },
    REJEITADA: {
      color: "text-red-600",
      message: "Infelizmente, sua solicitação foi rejeitada. Entre em contato com o abrigo para mais detalhes.",
    },
  };

  export const AdoptionStatusMessage = ({ status }) => {
    const statusInfo = statusMessages[status] || {
      color: "text-gray-600",
      message: "Status desconhecido. Aguarde atualizações.",
    };

    return (
      <li>
        <small className={statusInfo.color}>{statusInfo.message}</small>
      </li>
    );
  };
