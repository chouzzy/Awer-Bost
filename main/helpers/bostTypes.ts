

export interface ScrapedMVAs {
    ncm: string[]
}


export interface mvaDictTypes {
    mvaDict: [
        string,
        variants?: string[]
    ]
}

export interface userDataProps {
    username: string,
    password: string,
    filePath: string
  }