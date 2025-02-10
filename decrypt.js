document.addEventListener('DOMContentLoaded', () => {
    const inputs = {};
    const matrixFeedback = document.getElementById('matrixFeedback');
    const columnShiftSection = document.getElementById("columnShiftSection");
    const sboxSection = document.getElementById('sboxSection');
    const shiftRowsSection = document.getElementById("shiftRowsSection");
    const shiftFeedback = document.getElementById("shiftFeedback");
    const sboxCells = document.querySelectorAll('.sbox-cell');
    const reorderString = document.getElementById('reorderString');
    const reorderFeedback = document.getElementById('reorderFeedback');
    
    for (let i = 0; i <= 15; i++) {
        inputs[i] = document.getElementById(`X${i}`);
    }

    let expectedMatrix = [];

    let expectedShift = [];

    // Função para inicializar a descriptografia
    document.getElementById('startDecryptButton').addEventListener('click', function () {
        const encryptedBlock = document.getElementById('encryptedBlockInput').value;
        const key = document.getElementById('keyInput').value;

        if (encryptedBlock.length !== 16 || key.length !== 16) {
            alert("Por favor, insira um bloco e uma chave de 16 bits.");
            return;
        }

        for (let i = 0; i < 16; i++) {
            document.getElementById(`B${i}`).value = encryptedBlock[i];
            document.getElementById(`K${i}`).value = key[i];
        }

        document.getElementById('xorSection').classList.remove('d-none');
    });

    function checkXORCompletion() {
        let isValid = true;
        let allCorrect = true; // Verifica se todos os campos estão corretos

        for (let i = 0; i < 16; i++) {
            const xorValue = document.getElementById(`X${i}`).value;
            const bValue = document.getElementById(`B${i}`).value; // Valor do bloco criptografado
            const kValue = document.getElementById(`K${i}`).value; // Valor da chave
            const expectedXOR = bValue ^ kValue; // Resultado esperado da operação XOR

            // Verifica se o valor inserido é válido (0 ou 1)
            if (xorValue !== '0' && xorValue !== '1') {
                isValid = false;
                document.getElementById(`X${i}`).classList.remove('border-success');
            } else {
                // Verifica se o valor inserido está correto
                if (xorValue === expectedXOR.toString()) {
                    document.getElementById(`X${i}`).classList.add('border', 'border-success');
                } else {
                    document.getElementById(`X${i}`).classList.remove('border-success');
                    allCorrect = false; // Marca como incorreto
                }
            }
        }

        // Exibe feedback geral
        const xorFeedback = document.getElementById('xorFeedback');
        if (!isValid) {
            xorFeedback.textContent = "Preencha todos os campos com 0 ou 1.";
            xorFeedback.classList.remove("text-success");
        } else if (allCorrect) {
            xorFeedback.textContent = "Operação XOR realizada corretamente!";
            xorFeedback.classList.add("text-success");

            // Mostra a seção da matriz
            document.getElementById('matrixSection').classList.remove('d-none');
            window.location.href = '#matrixSection'; // Rola a página para a seção da matriz
        } else {
            xorFeedback.textContent = "Erro na operação XOR. Verifique os valores.";
            xorFeedback.classList.remove("text-success");
        }
    }

    for (let i = 0; i < 16; i++) {
        document.getElementById(`X${i}`).addEventListener('input', checkXORCompletion);
    }

    const matrixCells = document.querySelectorAll('.matrix-cell');
    matrixCells.forEach(cell => {
        cell.addEventListener('input', validateMatrix);
    });

    function validateMatrix() {
        let correct = true;

        expectedMatrix = [
            [inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value],
            [inputs[4].value, inputs[5].value, inputs[6].value, inputs[7].value],
            [inputs[8].value, inputs[9].value, inputs[10].value, inputs[11].value],
            [inputs[12].value, inputs[13].value, inputs[14].value, inputs[15].value]
        ];

        matrixCells.forEach((cell, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            const expectedValue = expectedMatrix[col][row];

            if (cell.value === expectedValue) {
                cell.classList.add('border', 'border-success');
            } else {
                cell.classList.remove('border-success');
                correct = false;
            }
        });

        if (correct) {
            matrixFeedback.textContent = 'Matriz preenchida corretamente!';
            matrixFeedback.classList.add('text-success');

            
            columnShiftSection.classList.remove('d-none');
            window.location.href = '#columnShiftSection';
            populateColumnShiftMatrix();
        } else {
            matrixFeedback.textContent = 'Preencha a matriz corretamente.';
            matrixFeedback.classList.remove('text-success');
        }
    }

    matrixCells.forEach(cell => {
        cell.addEventListener('input', validateMatrix);
    });

    const columns = document.querySelectorAll(".draggable-column");

    columns.forEach(column => {
        column.setAttribute("draggable", true); // Garante que os elementos podem ser arrastados
        column.addEventListener("dragstart", handleDragStart);
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
    });

    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.cellIndex);
        event.target.classList.add("dragging");
    }

    function handleDragOver(event) {
        event.preventDefault(); // Permite que o drop aconteça
    }

    function handleDrop(event) {
        event.preventDefault();
        
        const draggedIndex = parseInt(event.dataTransfer.getData("text"), 10);
        const targetIndex = event.target.cellIndex;
    
        if (draggedIndex === targetIndex || targetIndex === undefined) return;
    
        const table = document.getElementById("shiftColumnMatrix");
        const rows = Array.from(table.rows);
    
        rows.forEach(row => {
            const cells = Array.from(row.cells);
            
            // Trocamos as células de posição na linha
            row.insertBefore(cells[draggedIndex], cells[targetIndex]);
        });
    
        updateColumnIndexes();
        validateColumnShift(); // Chama a validação após a troca
    }
    

    function updateColumnIndexes() {
        const columns = document.querySelectorAll(".draggable-column");
        columns.forEach((column, index) => {
            column.dataset.index = index;
        });
    }


    function validateColumnShift() {
        const rows = Array.from(document.querySelectorAll('#shiftColumnMatrix tr'));
    
        // Criando a matriz deslocada uma posição à esquerda
        expectedShift = [
            [inputs[12].value, inputs[8].value, inputs[4].value, inputs[0].value], 
            [inputs[13].value, inputs[9].value, inputs[5].value, inputs[1].value], 
            [inputs[14].value, inputs[10].value, inputs[6].value, inputs[2].value], 
            [inputs[15].value, inputs[11].value, inputs[7].value, inputs[3].value]           
        ];
                
        console.log(expectedShift);

        let correct = true;
    
        for (let colIndex = 0; colIndex < 4; colIndex++) {
            let columnMatches = true;
    
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                const cell = rows[rowIndex].cells[colIndex];
                if (cell.textContent.trim() !== expectedShift[rowIndex][colIndex]) {
                    columnMatches = false;
                    break;
                }
            }
    
            const columnCells = Array.from(rows).map(row => row.cells[colIndex]);
            if (columnMatches) {
                columnCells.forEach(cell => {
                    cell.classList.add('border', 'border-success'); // Adiciona borda verde se correto
                    cell.classList.remove('border-danger'); // Remove borda vermelha caso exista
                });
            } else {
                columnCells.forEach(cell => {
                    cell.classList.remove('border-success'); // Remove borda verde se estiver errada
                    cell.classList.add('border', 'border-danger'); // Adiciona borda vermelha para erro
                });
                correct = false;
            }
        }
    
        const columnShiftFeedback = document.getElementById('columnShiftFeedback');
        if (correct) {
            columnShiftFeedback.textContent = "Deslocamento das colunas realizado corretamente!";
            columnShiftFeedback.classList.add("text-success");
            columnShiftFeedback.classList.remove("text-danger");
            shiftRowsSection.classList.remove("d-none");
            window.location.href = '#shiftRowsSection';
            populateShiftMatrix();
        } else {
            columnShiftFeedback.textContent = "Erro no deslocamento das colunas. Verifique a ordem.";
            columnShiftFeedback.classList.add("text-danger");
            columnShiftFeedback.classList.remove("text-success");
        }
    }
    


    function populateColumnShiftMatrix() {
        const columnShiftCells = document.querySelectorAll("#columnShiftSection td");
        
        const expectedMatrix = [
            [inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value],
            [inputs[4].value, inputs[5].value, inputs[6].value, inputs[7].value],
            [inputs[8].value, inputs[9].value, inputs[10].value, inputs[11].value],
            [inputs[12].value, inputs[13].value, inputs[14].value, inputs[15].value]
        ];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                columnShiftCells[i * 4 + j].textContent = expectedMatrix[j][i];
            }
        }
    }

    function populateShiftMatrix() {
        const rows = [
            [inputs[12].value, inputs[8].value, inputs[4].value, inputs[0].value], 
            [inputs[13].value, inputs[9].value, inputs[5].value, inputs[1].value], 
            [inputs[14].value, inputs[10].value, inputs[6].value, inputs[2].value], 
            [inputs[15].value, inputs[11].value, inputs[7].value, inputs[3].value]   
        ];

        const shiftCells = shiftMatrix.querySelectorAll("td");
        let index = 0;
        rows.forEach(row => {
            row.forEach(bit => {
                shiftCells[index].textContent = bit;
                index++;
            });
        });
    }

    shiftMatrix.addEventListener("dragstart", (event) => {
        if (event.target.classList.contains("draggable")) {
            draggedCell = event.target;
        }
    });

    shiftMatrix.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    shiftMatrix.addEventListener("drop", (event) => {
        event.preventDefault();
        if (event.target.classList.contains("draggable")) {
            
            let temp = draggedCell.textContent;
            draggedCell.textContent = event.target.textContent;
            event.target.textContent = temp;
            validateShiftRows();
        }
    });

    function validateShiftRows() {
        const rows = shiftMatrix.querySelectorAll("tr");

        const expectedShift = [
            [inputs[12].value, inputs[8].value, inputs[4].value, inputs[0].value], 
            [inputs[1].value, inputs[13].value, inputs[9].value, inputs[5].value], 
            [inputs[6].value, inputs[2].value, inputs[14].value, inputs[10].value], 
            [inputs[3].value, inputs[15].value, inputs[11].value, inputs[7].value]  
        ];


        console.log(expectedShift);

        let correct = true;

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, colIndex) => {
                const expectedValue = expectedShift[rowIndex][colIndex]; 
                if (cell.textContent === expectedValue) {
                    cell.classList.add('border', 'border-success');
                } else {
                    cell.classList.remove('border-success');
                    correct = false;
                }
            });
        });

        if (correct) {
            shiftFeedback.textContent = 'Deslocamento das linhas realizado corretamente!';
            shiftFeedback.classList.add('text-success');
            sboxSection.classList.remove('d-none');
            window.location.href = '#sboxSection';
            populateColumnShiftMatrix();
        } else {
            shiftFeedback.textContent = 'Erro no deslocamento das linhas. Verifique a ordem.';
            shiftFeedback.classList.remove('text-success');
        }
    }

    function applySBox(bit) {
        return bit === "0" ? "1" : "0"; // Inverte o bit
    }
    
    function validateSBoxMatrix() {
        let correct = true;
    
        // Mapeia os valores dos inputs originais para a matriz 4x4
        const originalBits = [
            [inputs[12].value, inputs[8].value, inputs[4].value, inputs[0].value], // Linha 1
            [inputs[1].value, inputs[13].value, inputs[9].value, inputs[5].value], // Linha 2
            [inputs[6].value, inputs[2].value, inputs[14].value, inputs[10].value], // Linha 3
            [inputs[3].value, inputs[15].value, inputs[11].value, inputs[7].value]  // Linha 4
        ];
    
        // Valida cada célula da matriz S-Box
        sboxCells.forEach((cell, index) => {
            // Calcula a posição na matriz original
            const row = Math.floor(index / 4); // Linha da matriz (0 a 3)
            const col = index % 4;             // Coluna da matriz (0 a 3)
    
            // Obtém o bit original e aplica a S-Box
            const originalBit = originalBits[row][col];
            const expectedBit = applySBox(originalBit);
    
            // Verifica se o valor da célula S-Box está correto
            if (cell.value === expectedBit) {
                cell.classList.add('border', 'border-success');
            } else {
                cell.classList.remove('border-success');
                correct = false;
            }
        });
    
        // Exibe feedback ao usuário
        if (correct) {
            sboxFeedback.textContent = 'Matriz da S-Box preenchida corretamente!';
            sboxFeedback.classList.add('text-success');
    
            // Mostra a próxima seção (deslocamento de linhas)
            reorderString.classList.remove('d-none');
        } else {
            sboxFeedback.textContent = 'Preencha a matriz corretamente de acordo com a S-Box.';
            sboxFeedback.classList.remove('text-success');
        }
    }
    
    // Adiciona o evento de input a cada célula da S-Box
    sboxCells.forEach(cell => {
        cell.addEventListener('input', validateSBoxMatrix);
    });

    function validateReorderString() {
        let correct = true;
        
        const sboxMatrix = [
            [document.getElementById("S0").value, document.getElementById("S4").value, document.getElementById("S8").value, document.getElementById("S12").value],
            [document.getElementById("S1").value, document.getElementById("S5").value, document.getElementById("S9").value, document.getElementById("S13").value],
            [document.getElementById("S2").value, document.getElementById("S6").value, document.getElementById("S10").value, document.getElementById("S14").value],
            [document.getElementById("S3").value, document.getElementById("S7").value, document.getElementById("S11").value, document.getElementById("S15").value]
        ];
    
        let reorderedBits = "";
    
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                reorderedBits += sboxMatrix[row][col];
            }
        }
    
        for (let i = 0; i < 16; i++) {
            let xCell = document.getElementById(`R${i}`);
            let expectedValue = reorderedBits[i];
    
            if (xCell.value === expectedValue) {
                xCell.classList.remove("border-danger");
                xCell.classList.add("border", "border-success");
            } else {
                xCell.classList.add("border", "border-danger");
                xCell.classList.remove("border-success");
                correct = false;
            }
        }
    
        let reorderFeedback = document.getElementById("reorderFeedback");
        if (correct) {
            reorderFeedback.textContent = "Todos os valores estão corretos!";
            reorderFeedback.classList.add("text-success");
            reorderFeedback.classList.remove("text-error");
        } else {
            reorderFeedback.textContent = "Alguns valores estão incorretos. Verifique!";
            reorderFeedback.classList.add("text-error");
            reorderFeedback.classList.remove("text-success");
        }
    }
    
    document.addEventListener("DOMContentLoaded", validateReorderString);
    
    for (let i = 0; i < 16; i++) {
        document.getElementById(`R${i}`).addEventListener("input", validateReorderString);
    }
    
});
