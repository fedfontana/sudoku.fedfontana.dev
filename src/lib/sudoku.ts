export type SudokuCellContent = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
export class Sudoku {
	private cells: SudokuCellContent[] = [];
	private initialCells: SudokuCellContent[] = [];
	private readonly size: number = 9;

	constructor(content: SudokuCellContent[]) {
		console.assert(content.length === this.size * this.size, 'Invalid sudoku size');

		this.cells = content;
		//TODO: find better way to copy array
		this.initialCells = JSON.parse(JSON.stringify(content));
	}

	public cell(row: number, column: number): SudokuCellContent {
		return this.cells[this.indexof(row, column)];
	}

	// Get the index of the cell in the linear array. Row and column are one-based.
	public indexof(row: number, column: number): number {
		console.assert(row >= 1 && row <= this.size, 'Invalid row');
		console.assert(column >= 1 && column <= this.size, 'Invalid column');
		return (row - 1) * (this.size + (column - 1));
	}

	public coordinates(index: number): [number, number] {
		console.assert(index >= 0 && index < this.size * this.size, 'Invalid index');
		return [Math.floor(index / this.size), index % this.size];
	}

	public row(row: number): SudokuCellContent[] {
		console.assert(row > 0 && row <= this.size, 'Invalid row');
		return this.cells.slice((row - 1) * this.size, row * this.size);
	}

	public column(column: number): SudokuCellContent[] {
		console.assert(column > 0 && column <= this.size, 'Invalid column');
		return this.cells.filter((_, index) => index % this.size === column - 1);
	}

	public blockOf(row: number, col: number): SudokuCellContent[] {
		console.assert(row > 0 && row <= this.size, 'Invalid row');
		console.assert(col > 0 && col <= this.size, 'Invalid column');

		const blockRow = Math.floor(row / 3);
		const blockCol = Math.floor(col / 3);
		const start = blockRow * 3 * this.size + blockCol * 3;
		const end = start + 3 * this.size;
		const result: SudokuCellContent[] = [];
		for (let i = start; i < end; i += this.size) {
			result.push(this.cell(i, i + 1));
		}

		return result;
	}

	public blockIdx(row: number, col: number): number {
		const blockRow = Math.floor(row / 3);
		const blockCol = Math.floor(col / 3);
		return blockRow * 3 + blockCol;
	}

	public isInitial(row: number, col: number): boolean {
		return this.initialCells[this.indexof(row, col)] !== null;
	}

	public setCell(row: number, col: number, value: SudokuCellContent): void {
		this.cells[this.indexof(row, col)] = value;
	}
}

export class Game {}
