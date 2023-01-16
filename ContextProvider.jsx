import { createContext, useState } from 'react'

export const AppContext = createContext()

export const ContextProvider = ({ children }) => {
    const [alertNow, setAlertNow] = useState("")
    const [user, setUser] = useState({})
    const [allProducts, setAllProducts] = useState({});
    const [topSellersProducts, setTopSellersProducts] = useState({});
    const [selectedBtn, setSelectedBtn] = useState({
        all: true,
        favorites: false,
    })
    return (
        <AppContext.Provider value={{
            alertNow, setAlertNow,
            user, setUser,
            allProducts, setAllProducts,
            topSellersProducts, setTopSellersProducts,
            selectedBtn, setSelectedBtn
        }}>
            {children}
        </AppContext.Provider>
    )
}