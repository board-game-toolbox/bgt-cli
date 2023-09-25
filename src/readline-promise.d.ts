declare module 'readline-promise' {
  import * as readline from 'readline'

  class ReadlinePromise {
    static createInterface(options: ReadLineOptions): ReadlinePromise
    questionAsync(question: string): Promise<string>
    close(): void
  }

  export = ReadlinePromise
}
