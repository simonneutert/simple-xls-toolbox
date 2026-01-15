function permute(arr: string[]): string[][] {
  const results: string[][] = [];
  const n = arr.length;
  if (n === 1) return [arr.slice()];
  const stack: { curr: string[]; rest: string[] }[] = [{ curr: [], rest: arr }];
  while (stack.length) {
    const { curr, rest } = stack.pop()!;
    if (rest.length === 0) {
      results.push(curr);
    } else {
      for (let i = 0; i < rest.length; i++) {
        stack.push({
          curr: curr.concat(rest[i]),
          rest: rest.slice(0, i).concat(rest.slice(i + 1)),
        });
      }
    }
  }
  return results;
}

function getAllNonEmptySubsets(arr: string[]): string[][] {
  const n = arr.length;
  const result: string[][] = [];
  for (let mask = 1; mask < (1 << n); mask++) {
    const subset: string[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(arr[i]);
    }
    result.push(subset);
  }
  return result;
}

export function generateStringCombinations(input: string[]): string[] {
  const results: Set<string> = new Set();
  const subsets = getAllNonEmptySubsets(input);
  for (const subset of subsets) {
    for (const perm of permute(subset)) {
      results.add(perm.join(","));
    }
  }
  return Array.from(results);
}
