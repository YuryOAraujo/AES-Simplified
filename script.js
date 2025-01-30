document.addEventListener('DOMContentLoaded', () => {
    const charInput1 = document.getElementById('charInput1');
    const charInput2 = document.getElementById('charInput2');
    const convertButton = document.getElementById('convertButton');
    const keyInput = document.getElementById('keyInput');
    const generateKeyButton = document.getElementById('generateKeyButton');
    const result1 = document.getElementById('result1');
    const result2 = document.getElementById('result2');
    const binarySection = document.getElementById('binarySection');
    const matrixSection = document.getElementById('matrixSection');
    const binaryInput = document.getElementById('binaryInput');
    const binaryFeedback = document.getElementById('binaryFeedback');
    const matrixCells = document.querySelectorAll('.matrix-cell');
    const matrixFeedback = document.getElementById('matrixFeedback');
    const sboxSection = document.getElementById('sboxSection');
    const sboxCells = document.querySelectorAll('.sbox-cell');
    const sboxFeedback = document.getElementById('sboxFeedback');
    const shiftMatrix = document.getElementById("shiftMatrix");
    const shiftRowsSection = document.getElementById("shiftRowsSection");
    const shiftFeedback = document.getElementById("shiftFeedback");
    const columnShiftSection = document.getElementById("columnShiftSection");
    const columnShiftMatrix = document.getElementById("shiftColumnMatrix");
    const columnShiftFeedback = document.getElementById("columnShiftFeedback");
    const xorSection = document.getElementById("xorSection");
    let draggedCell = null;

    const keyGenerationListener = () => generateRandomKey();

    generateKeyButton.addEventListener('click', keyGenerationListener);

    convertButton.addEventListener('click', () => {
        const char1 = charInput1.value;
        const char2 = charInput2.value;

        if (char1.length === 1 && char2.length === 1) {
            const binary1 = charToBinary(char1);
            const binary2 = charToBinary(char2);
            result1.textContent = `Primeiro caractere (${char1}): ${binary1}`;
            result2.textContent = `Segundo caractere (${char2}): ${binary2}`;

            binarySection.classList.remove('d-none');
            window.location.href = '#binarySection';
        } else {
            result1.textContent = '';
            result2.textContent = '';
            alert('Por favor, insira exatamente dois caracteres.');
        }
    });

    function validateKeyInput(input) {
        input.value = input.value.replace(/[^01]/g, '').slice(0, 16);
    }    

    binaryInput.addEventListener('input', () => {
        const char1 = charInput1.value;
        const char2 = charInput2.value;
        const expectedBinary = charToBinary(char1) + charToBinary(char2);

        if (binaryInput.value === expectedBinary) {
            binaryInput.classList.add('border', 'border-success');
            binaryFeedback.textContent = 'Correto! Agora, preencha a matriz 4x4.';
            binaryFeedback.classList.add('text-success');

            matrixSection.classList.remove('d-none');
            window.location.href = '#matrixSection';
        } else {
            binaryInput.classList.remove('border-success');
            binaryFeedback.textContent = '';
        }
    });

    function charToBinary(char) {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }

    function generateRandomKey() {
        keyInput.value = Array.from({ length: 16 }, () => Math.round(Math.random())).join('');
        populateXORMatrix();
    }

    
    function applySBox(bit) {
        return bit === "0" ? "1" : "0"; 
    }

    function validateMatrix() {
        const char1 = charInput1.value;
        const char2 = charInput2.value;
        const expectedBinary = charToBinary(char1) + charToBinary(char2);
        const expectedValues = expectedBinary.match(/.{1,1}/g);

        const expectedMatrix = [
            [expectedValues[0], expectedValues[1], expectedValues[2], expectedValues[3]],
            [expectedValues[4], expectedValues[5], expectedValues[6], expectedValues[7]],
            [expectedValues[8], expectedValues[9], expectedValues[10], expectedValues[11]],
            [expectedValues[12], expectedValues[13], expectedValues[14], expectedValues[15]]
        ];

        let correct = true;

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

            
            sboxSection.classList.remove('d-none');
            window.location.href = '#sboxSection';
        } else {
            matrixFeedback.textContent = 'Preencha a matriz corretamente.';
            matrixFeedback.classList.remove('text-success');
        }
    }

    matrixCells.forEach(cell => {
        cell.addEventListener('input', validateMatrix);
    });

    function validateSBoxMatrix() {
        let correct = true;

        sboxCells.forEach((cell, index) => {
            const originalBit = matrixCells[index].value; 
            const expectedBit = applySBox(originalBit); 

            if (cell.value === expectedBit) {
                cell.classList.add('border', 'border-success');
            } else {
                cell.classList.remove('border-success');
                correct = false;
            }
        });

        if (correct) {
            sboxFeedback.textContent = 'Matriz da S-Box preenchida corretamente!';
            sboxFeedback.classList.add('text-success');

            
            shiftRowsSection.classList.remove('d-none');
            window.location.href = '#shiftRowsSectionsSection';
            populateShiftMatrix();
        } else {
            sboxFeedback.textContent = 'Preencha a matriz corretamente de acordo com a S-Box.';
            sboxFeedback.classList.remove('text-success');
        }
    }
 
    sboxCells.forEach(cell => {
        cell.addEventListener('input', validateSBoxMatrix);
    });

    function populateShiftMatrix() {
        const sboxValues = Array.from(sboxCells).map(cell => cell.value);
 
        const rows = [
            [sboxValues[0], sboxValues[1], sboxValues[2], sboxValues[3]],
            [sboxValues[4], sboxValues[5], sboxValues[6], sboxValues[7]],
            [sboxValues[8], sboxValues[9], sboxValues[10], sboxValues[11]],
            [sboxValues[12], sboxValues[13], sboxValues[14], sboxValues[15]]
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

        const sboxValues = Array.from(sboxCells).map(cell => cell.value);

        const expectedShift = [
            [sboxValues[0], sboxValues[1], sboxValues[2], sboxValues[3]], 
            [sboxValues[5], sboxValues[6], sboxValues[7], sboxValues[4]], 
            [sboxValues[10], sboxValues[11], sboxValues[8], sboxValues[9]], 
            [sboxValues[15], sboxValues[12], sboxValues[13], sboxValues[14]]  
        ];

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
            columnShiftSection.classList.remove('d-none');
            window.location.href = '#columnShiftSection';
            populateColumnShiftMatrix();
        } else {
            shiftFeedback.textContent = 'Erro no deslocamento das linhas. Verifique a ordem.';
            shiftFeedback.classList.remove('text-success');
        }
    }

    function populateColumnShiftMatrix() {
        const shiftCells = shiftMatrix.querySelectorAll("td");
        const columnShiftCells = document.querySelectorAll("#shiftColumnMatrix td");

        
        shiftCells.forEach((cell, index) => {
            columnShiftCells[index].textContent = cell.textContent;
        });
    }

    const columns = document.querySelectorAll(".draggable-column");

    columns.forEach(column => {
        column.addEventListener("dragstart", handleDragStart);
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
    });

    function handleDragStart(event) {
        event.dataTransfer.setData("text", event.target.id); 
    }

    function handleDragOver(event) {
        event.preventDefault(); 
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedColumnId = event.dataTransfer.getData("text"); 
        const draggedColumn = document.getElementById(draggedColumnId);
        const targetColumn = event.target;

        if (targetColumn && targetColumn !== draggedColumn) {
            
            const draggedIndex = Array.from(targetColumn.parentElement.children).indexOf(draggedColumn);
            const targetIndex = Array.from(targetColumn.parentElement.children).indexOf(targetColumn);
            const rows = Array.from(columnShiftMatrix.rows);

            rows.forEach(row => {
                const temp = row.cells[draggedIndex].textContent;
                row.cells[draggedIndex].textContent = row.cells[targetIndex].textContent;
                row.cells[targetIndex].textContent = temp;
            });

            validateColumnShift();
        }
    }

    function validateColumnShift() {
        const rows = Array.from(document.querySelectorAll('#shiftColumnMatrix tr'));
        const sboxValues = Array.from(sboxCells).map(cell => cell.value);

        const expectedShift = [
            [sboxValues[3], sboxValues[0], sboxValues[1], sboxValues[2]], 
            [sboxValues[4], sboxValues[5], sboxValues[6], sboxValues[7]], 
            [sboxValues[9], sboxValues[10], sboxValues[11], sboxValues[8]], 
            [sboxValues[14], sboxValues[15], sboxValues[12], sboxValues[13]]  
        ];

        let correct = true;

        for (let colIndex = 0; colIndex < 4; colIndex++) {
            let columnMatches = true;

            
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                const cell = rows[rowIndex].cells[colIndex];
                if (cell.textContent !== expectedShift[rowIndex][colIndex]) {
                    columnMatches = false;
                    break;
                }
            }
            
            const columnCells = Array.from(rows).map(row => row.cells[colIndex]);
            if (columnMatches) {
                columnCells.forEach(cell => {
                    cell.classList.add('border', 'border-success');
                });
            } else {
                columnCells.forEach(cell => {
                    cell.classList.remove('border-success');
                });
                correct = false;
            }
        }

        const columnShiftFeedback = document.getElementById('columnShiftFeedback');
        if (correct) {
            columnShiftFeedback.textContent = "Deslocamento das colunas realizado corretamente!";
            columnShiftFeedback.classList.add("text-success");
            xorSection.classList.remove("d-none");
            window.location.href = '#xorSection';
            populateXORMatrix();
        } else {
            columnShiftFeedback.textContent = "Erro no deslocamento das colunas. Verifique a ordem.";
            columnShiftFeedback.classList.remove("text-success");
        }
    }

    function populateXORMatrix() {
        
        const sboxValues = Array.from(sboxCells).map(cell => cell.value); 

        const expectedShift = [
            [sboxValues[3], sboxValues[0], sboxValues[1], sboxValues[2]], 
            [sboxValues[4], sboxValues[5], sboxValues[6], sboxValues[7]], 
            [sboxValues[9], sboxValues[10], sboxValues[11], sboxValues[8]], 
            [sboxValues[14], sboxValues[15], sboxValues[12], sboxValues[13]]  
        ];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                
                const matrixValue = expectedShift[i][j];
                const inputId = `M${i * 4 + j}`; 
                const keyId = `K${i * 4 + j}`; 
                document.getElementById(inputId).value = matrixValue; 
                document.getElementById(keyId).value = keyInput.value[i * 4 + j]; 
            }
        }

        validateXOR();
    }

    function validateXOR() {
        const xorMixColumnsCells = document.querySelectorAll("#xorMatrix .form-control[id^='M']");
        const xorKeyCells = document.querySelectorAll("#xorMatrix .form-control[id^='K']");
        const xorInputCells = document.querySelectorAll("#xorMatrix .form-control[id^='X']");

        let correct = true;

        xorInputCells.forEach((cell, index) => {
            const mixColumnsBit = xorMixColumnsCells[index].value;
            const keyBit = xorKeyCells[index].value;
            const expectedXOR = mixColumnsBit ^ keyBit; 
            const userXOR = cell.value;

            if (userXOR === expectedXOR.toString()) {
                cell.classList.add('border', 'border-success');
            } else {
                cell.classList.remove('border-success');
                correct = false;
            }
        });

        const xorFeedback = document.getElementById('xorFeedback');
        if (correct) {
            xorFeedback.textContent = "Operação XOR realizada corretamente!";
            xorFeedback.classList.add("text-success");
            document.getElementById('copyXORButton').classList.remove('d-none'); 
            window.location.href = '#copyXORButton';
        } else {
            xorFeedback.textContent = "Erro na operação XOR. Verifique os valores.";
            xorFeedback.classList.remove("text-success");
            document.getElementById('copyXORButton').classList.add('d-none'); 
        }
    }
    
    function copyXORResult() {
        const xorInputCells = document.querySelectorAll("#xorMatrix .form-control[id^='X']");
        let xorResult = '';

        xorInputCells.forEach(cell => {
            xorResult += cell.value;
        });

        navigator.clipboard.writeText(xorResult).then(() => {
            alert("Resultado XOR copiado para a área de transferência!");
        }).catch(() => {
            alert("Erro ao copiar o resultado XOR.");
        });
    }
    
    const xorInputCells = document.querySelectorAll("#xorMatrix .form-control[id^='X']");
    xorInputCells.forEach(cell => {
        cell.addEventListener('input', validateXOR);
    });

    document.getElementById('copyXORButton').addEventListener('click', copyXORResult);
});