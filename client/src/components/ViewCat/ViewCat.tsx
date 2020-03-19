import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'antd'
import { EyeFilled, HeartFilled, HeartOutlined } from '@ant-design/icons'
import FavoritesContext from '../../context/favorites/FavoritesContext'
import ImageContainer from './components/ImageContainer'
import Breeds from './components/Breeds'

import { ICat, IFavorite } from '../../types'

let apiUrl: string
if (process.env.NODE_ENV !== 'production') {
  apiUrl = 'http://localhost:6125'
} else {
  apiUrl = ''
}

export default function ViewCat() {
  const [currentCat, setCurrentCat] = useState<ICat | null>(null)
  const [loadingCat, setLoadingCat] = useState<boolean>(false)
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false)

  const { addFavorite, removeFavorite, favorites, isAddingToFavs, isRemovingFromFavs } = useContext(
    FavoritesContext
  )

  useEffect(() => {
    if (currentCat)
      setIsInFavorites(favorites.some((favorite: IFavorite) => favorite.id === currentCat.id))
  }, [favorites, currentCat])

  const getRandomCat = async () => {
    setCurrentCat(null)
    setLoadingCat(true)
    try {
      const { status, data } = await axios.get(`${apiUrl}/api/cats/random`)
      if (status !== 200) return
      const { id, url, width, height } = data[0]
      setCurrentCat({ id, url, width, height })
    } catch (error) {
      throw new Error(error)
    } finally {
      setLoadingCat(false)
    }
  }

  const handleAddFavorite = (cat: ICat) => {
    addFavorite(cat)
  }

  const handleRemoveFavorite = (id: number) => {
    removeFavorite(id)
  }

  return (
    <>
      <Button type='primary' icon={<EyeFilled />} onClick={getRandomCat} loading={loadingCat}>
        Show me random cat!
      </Button>
      <p />
      <Breeds apiUrl={apiUrl} setCurrentCat={setCurrentCat} />
      {currentCat && (
        <div className='image-viewer'>
          <>
            <p />
            <ImageContainer
              url={currentCat.url}
              height={currentCat.height}
              width={currentCat.width}
            />
            <p />
            {isInFavorites ? (
              <Button
                icon={<HeartOutlined />}
                type='dashed'
                onClick={() => handleRemoveFavorite(currentCat.id)}
                loading={isRemovingFromFavs}
              >
                Remove from favorites
              </Button>
            ) : (
              <Button
                icon={<HeartFilled />}
                type='danger'
                onClick={() => handleAddFavorite(currentCat)}
                loading={isAddingToFavs}
              >
                Add to favorites
              </Button>
            )}
            <p />
          </>
        </div>
      )}
    </>
  )
}
