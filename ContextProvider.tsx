import { SetStateAction, createContext, useState, Dispatch, ReactNode } from 'react'
import IUser from './interfaces/IUser'

interface IPages {
    general: {
        all: number,
        favorites: number,
        search: number,
        filter: string
    },
    top_sellers: number
}

interface ISelectedBtn { all: boolean, favorites: boolean }

type authContextType = {
    selectedBtn: ISelectedBtn, setSelectedBtn: Dispatch<SetStateAction<ISelectedBtn>>,
    visibleModal: boolean, setVisibleModal: Dispatch<SetStateAction<boolean>>,
    pages: IPages, setPages: Dispatch<SetStateAction<IPages>>,
    title: string, setTitle: Dispatch<SetStateAction<string>>,
    searchValue: string, setSearchValue: Dispatch<SetStateAction<string>>,
}

const placeholder_pages: IPages = {
    general: {
        all: 1,
        favorites: 1,
        search: 1,
        filter: "all"
    },
    top_sellers: 1
}

const authContextDefaultValues: authContextType = {
    selectedBtn: { all: true, favorites: false }, setSelectedBtn: () => { },
    visibleModal: false, setVisibleModal: () => { },
    pages: placeholder_pages, setPages: () => { },
    title: "", setTitle: () => { },
    searchValue: "", setSearchValue: () => { }
}

export const AppContext = createContext<authContextType>(authContextDefaultValues)

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [selectedBtn, setSelectedBtn] = useState({ all: true, favorites: false })
    const [pages, setPages] = useState(placeholder_pages)
    const [visibleModal, setVisibleModal] = useState(false)
    const [title, setTitle] = useState("Todos os produtos")
    const [searchValue, setSearchValue] = useState("")

    const globalStates = {
        pages, setPages,
        selectedBtn, setSelectedBtn,
        visibleModal, setVisibleModal,
        title, setTitle,
        searchValue, setSearchValue
    }

    return (
        <AppContext.Provider value={globalStates}>
            {children}
        </AppContext.Provider>
    )
}