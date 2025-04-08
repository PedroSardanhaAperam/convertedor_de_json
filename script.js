function updateFileName() {
    const fileInput = document.getElementById('jsonFile');
    const fileNameDisplay = document.getElementById('fileName');
    const file = fileInput.files[0];

    if (file) {
        fileNameDisplay.textContent = `Arquivo carregado: ${file.name}`;
    } else {
        fileNameDisplay.textContent = "Nenhum arquivo carregado";
    }
}

function convertFile() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];
    const outputFileNameInput = document.getElementById('outputFileName').value.trim();
    
    if (!file) {
        alert('Por favor, faça o upload de um arquivo JSON.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            const outputFileName = outputFileNameInput || file.name.replace(/\.json$/i, ''); // Usa o nome original do arquivo JSON

            if (document.getElementById('fileType').value === 'csv') {
                // Converter JSON para CSV
                const keys = Object.keys(jsonData[0]);
                const csv = [
                    keys.join(','), // Linha de cabeçalhos
                    ...jsonData.map(obj =>
                        keys.map(key => formatCSVValue(obj[key])).join(',')
                    ) // Linhas de dados formatadas corretamente
                ].join('\n');

                // Criar link de download
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${outputFileName}.csv`; // Nome do arquivo final
                a.click();
                URL.revokeObjectURL(url);
            } else {
                // Converter JSON para XLSX
                const worksheet = XLSX.utils.json_to_sheet(jsonData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                // Criar arquivo XLSX
                XLSX.writeFile(workbook, `${outputFileName}.xlsx`); // Nome do arquivo final
            }
        } catch (error) {
            alert('Arquivo JSON inválido. Por favor, envie um arquivo JSON formatado corretamente.');
        }
    };
    reader.readAsText(file);
}

function formatCSVValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    const stringValue = value.toString();
    // Adiciona aspas apenas se necessário (ex.: contém vírgulas, aspas ou quebras de linha)
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`; // Escapa aspas duplas corretamente
    }
    return stringValue;
}
