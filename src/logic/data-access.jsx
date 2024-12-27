import { useEffect, useState, createContext, useContext } from "react"

const DataContext = createContext()

const BASE_URL = 'https://script.google.com/macros/s/AKfycbzcYxwlkisg8XofsKtUdIVGOqlrF1-UAE9HXjbS5LN5I7Ov0Dl62vuAUB8bXkxwmeoE/exec'

export function DataProvider({ children, reload }) {
  const [data, setData] = useState([])
  const [updateTimeout, setUpdateTimeout] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}?action=load`)
      .then((res) => res.json())
      .then((data) => setData(data.state))
      .catch((err) => console.error(err))

    function reloadData () {
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
  
      const timeout = setTimeout(() => {
        fetch(`${BASE_URL}?action=load`)
          .then((res) => res.json())
          .then((data) => setData(data.state))
          .catch((err) => console.error(err))
          .then(reloadData)
      }, 5000)
  
      setUpdateTimeout(timeout)
    }

    if (reload) {
      reloadData()
    }
  }, [])

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
}

export function useData() {
  return useContext(DataContext)
}
