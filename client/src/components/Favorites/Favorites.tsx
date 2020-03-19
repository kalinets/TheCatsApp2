import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, Row, Col } from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { ROUTES } from '../../constants'
import FavoritesContext from '../../context/favorites/FavoritesContext'

import { ICat } from '../../types'

export default function Favorites(): JSX.Element | null {
  const { favorites, loading, isRemovingManyFromFavs, removeManyFavorites } = useContext(
    FavoritesContext
  )

  const [markedRemoved, setMarkedRemoved] = useState<number[]>([])

  const history = useHistory()

  useEffect(() => {
    if (favorites.length === 0 && !loading) {
      history.push(ROUTES.viewCatPage)
    }
  }, [favorites])

  const handleRemove = async (id: number) => {
    setMarkedRemoved([...markedRemoved, id])
  }

  const handleAddBack = async (cat: ICat) => {
    setMarkedRemoved(markedRemoved.filter(item => item !== cat.id))
  }

  const handleBatchRemove = () => {
    removeManyFavorites(markedRemoved)
    setMarkedRemoved([])
  }

  if (loading) return <p>Loading...</p>
  if (!favorites.length) return null
  return (
    <Row gutter={[8, 8]} justify='center'>
      <Col span={24} style={{ height: '50px' }}>
        {!!markedRemoved.length && (
          <Button
            icon={<WarningFilled />}
            size='large'
            type='danger'
            onClick={() => handleBatchRemove()}
            loading={isRemovingManyFromFavs}
          >
            Remove selected
          </Button>
        )}
      </Col>
      {favorites.map((cat: ICat) => (
        <Col key={cat.id} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            hoverable
            cover={
              <img
                alt='cat image'
                src={cat.url}
                style={{ opacity: markedRemoved.includes(cat.id) ? '.3' : 1 }}
              />
            }
          >
            {markedRemoved.includes(cat.id) ? (
              <Button
                disabled={isRemovingManyFromFavs}
                type='primary'
                onClick={() => handleAddBack(cat)}
              >
                Don't remove
              </Button>
            ) : (
              <Button disabled={isRemovingManyFromFavs} onClick={() => handleRemove(cat.id)}>
                Mark to remove
              </Button>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
}
