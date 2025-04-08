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
    const outputFileNameInput = document.getElementById('outputFileName').value || 'converted_file';
    const fileType = document.getElementById('fileType').value;

    if (!file) {
        alert('Por favor, faça o upload de um arquivo JSON.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const jsonData = JSON.parse(event.target.result);

            if (fileType === 'csv') {
                // Converter para CSV
                const keys = Object.keys(jsonData[0]);
                const csv = [
                    keys.join(','), // Header row
                    ...jsonData.map(obj => keys.map(key => obj[key]).join(',')) // Data rows
                ].join('\n');

                // Criar link de download
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${outputFileNameInput}.csv`;
                a.click();
                URL.revokeObjectURL(url);
            } else if (fileType === 'xlsx') {
                // Converter para XLSX
                const worksheet = XLSX.utils.json_to_sheet(jsonData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                // Criar arquivo XLSX
                XLSX.writeFile(workbook, `${outputFileNameInput}.xlsx`);
            }
        } catch (error) {
            alert('Arquivo JSON inválido. Por favor, envie um arquivo JSON formatado corretamente.');
        }
    };
    reader.readAsText(file);
}
