export function encodeBoard(board: number[]): string {
	return board.join('');
}

export function decodeBoard(encoded: string): number[] {
	if (encoded.length !== 81) {
		throw new Error('Invalid board length');
	}
	return encoded.split('').map((c) => parseInt(c, 10));
}
