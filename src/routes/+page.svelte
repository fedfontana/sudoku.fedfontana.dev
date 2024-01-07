<script lang="ts">
	type SudokuCell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

	const initial: SudokuCell[] = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
		7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0
	];
	const board: SudokuCell[] = JSON.parse(JSON.stringify(initial));
	console.assert(board.length === 81);

	// https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
	export function clickOutside(node: HTMLElement) {
		const handleClick = (event) => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside'));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	let selectedRow: number | null = null;
	let selectedCol: number | null = null;
	let selectedBox: number | null = null;

	let selectedCell: SudokuCell | null = null;

	let errors: Set<number> = new Set();

	//TODO: this could be done better:
	// - when a number has been deleted, only check the row, column and box of that number
	// - when a number has been added, only check the row, column and box of that number
	function updateErrorsAfterUpdate() {
		const newErrors = new Set<number>();

		for (let i = 0; i < 81; i++) {
			const row = Math.floor(i / 9) + 1;
			const col = (i % 9) + 1;
			const box = Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1;

			const cell = board[i];
			if (cell === 0) {
				continue;
			}

			// Check row
			for (let j = 0; j < 9; j++) {
				const idx = (row - 1) * 9 + j;
				if (i === idx) {
					continue;
				}
				if (board[idx] === cell) {
					newErrors.add(i);
					newErrors.add(idx);
				}
			}

			// Check col
			for (let j = 0; j < 9; j++) {
				const idx = j * 9 + (col - 1);
				if (i === idx) {
					continue;
				}
				if (board[idx] === cell) {
					newErrors.add(i);
					newErrors.add(idx);
				}
			}

			// Check block
			for (const idx of idexesOfBlock(box - 1)) {
				if (i === idx) {
					continue;
				}
				if (board[idx] === cell) {
					newErrors.add(i);
					newErrors.add(idx);
				}
			}
		}
		errors = newErrors;
	}

	function idexesOfBlock(blockIdx: number): number[] {
		// Returns the indexs of the cells in the block
		// blockIdx is 0-indexed
		const row = Math.floor(blockIdx / 3);
		const col = blockIdx % 3;
		const startIdx = row * 27 + col * 3;
		const indexes = [];
		for (let i = 0; i < 3; i++) {
			indexes.push(startIdx + i * 9);
			indexes.push(startIdx + i * 9 + 1);
			indexes.push(startIdx + i * 9 + 2);
		}
		return indexes;
	}

	let comments: Map<number, number[]> = new Map();
	comments.set(0, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

	$: {
		if (selectedRow === null || selectedCol === null) {
			selectedCell = null;
			selectedBox = null;
		} else {
			const cellIdx = (selectedRow - 1) * 9 + (selectedCol - 1);
			selectedCell = board[cellIdx];
			selectedBox = Math.floor((selectedRow - 1) / 3) * 3 + Math.floor((selectedCol - 1) / 3) + 1;
		}
	}
</script>

<svelte:window
	on:keyup|preventDefault={(event) => {
		if (selectedRow === null || selectedCol === null) {
			return;
		}

		const cellIdx = (selectedRow - 1) * 9 + (selectedCol - 1);
		const isInitial = initial[cellIdx] !== 0;

		switch (event.key) {
			case 'ArrowUp': {
				if (selectedRow > 1) {
					selectedRow--;
				}
				return;
			}
			case 'ArrowDown': {
				if (selectedRow < 9) {
					selectedRow++;
				}
				return;
			}
			case 'ArrowLeft': {
				if (selectedCol > 1) {
					selectedCol--;
				}
				return;
			}
			case 'ArrowRight': {
				if (selectedCol < 9) {
					selectedCol++;
				}
				return;
			}
		}

		if (isInitial) {
			return;
		}
		switch (event.key) {
			case 'Backspace': {
				board[cellIdx] = 0;
				break;
			}
			case '1': {
				board[cellIdx] = 1;
				break;
			}
			case '2': {
				board[cellIdx] = 2;
				break;
			}
			case '3': {
				board[cellIdx] = 3;
				break;
			}
			case '4': {
				board[cellIdx] = 4;
				break;
			}
			case '5': {
				board[cellIdx] = 5;
				break;
			}
			case '6': {
				board[cellIdx] = 6;
				break;
			}
			case '7': {
				board[cellIdx] = 7;
				break;
			}
			case '8': {
				board[cellIdx] = 8;
				break;
			}
			case '9': {
				board[cellIdx] = 9;
				break;
			}
		}
		updateErrorsAfterUpdate();
	}}
/>

<!--FIXME: aria-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	use:clickOutside
	on:click_outside={() => {
		selectedRow = null;
		selectedCol = null;
		selectedBox = null;
	}}
	class="mx-auto mt-12 grid w-fit grid-cols-9 grid-rows-9 border-2 border-black"
>
	{#each board as cell, i}
		{@const row = Math.floor(i / 9) + 1}
		{@const col = (i % 9) + 1}
		{@const box = Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1}
		{@const isExactCell = row === selectedRow && col === selectedCol}
		{@const isRelatedToCurrent = selectedBox === box || row === selectedRow || col === selectedCol}
		{@const isSameCellContent = cell === selectedCell}
		{@const isErrored = errors.has(i)}
		{@const isFilled = cell !== 0}
		{@const isInitial = initial[i] !== 0}
		{@const cellComments = comments.get(i) || []}
		<div
			on:click={() => {
				selectedRow = row;
				selectedCol = col;
			}}
			class="relative flex h-12 w-12 cursor-pointer items-center justify-center
            border-gray-400 text-xl font-semibold selection:bg-none"
			class:border-b-black={row % 3 === 0}
			class:border-b-2={row !== 9}
			class:border-r-black={col % 3 === 0}
			class:border-r-2={col !== 9}
			class:bg-gray-200={!isExactCell && isRelatedToCurrent}
			class:bg-blue-300={isFilled && !isExactCell && isSameCellContent}
			class:bg-blue-200={isExactCell && !isErrored}
			class:bg-red-200={!isExactCell && isErrored}
			class:bg-red-400={isExactCell && isErrored}
			class:text-black={isInitial}
			class:text-blue-500={!isInitial && !isErrored}
			class:text-red-700={!isInitial && isErrored}
		>
			{#if isFilled}
				{cell}
			{:else}
				{#each cellComments as comment}
					{@const commentTop = Math.floor((comment - 1) / 3) * 33.33}
					{@const commentLeft = ((comment - 1) % 3) * 33.33}
					<div
						class="absolute h-1/3 w-1/3 text-center text-xs font-normal"
						class:text-gray-500={selectedCell !== comment}
						class:text-blue-500={selectedCell === comment}
						style="top: {commentTop}%; left: {commentLeft}%;"
					>
						{comment}
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</div>
