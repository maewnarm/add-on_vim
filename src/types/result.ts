export type ResultType = ResultTableType[] | null

export type ResultTableType = {
  columns: string[]
  values: (number|string)[][]
}