import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Select } from 'antd'

import { IBreed, ICat } from '../../../types/index'

type Props = {
  apiUrl: string
  setCurrentCat(arg0: ICat | null): void
}

export default function Breeds({ apiUrl, setCurrentCat }: Props): JSX.Element {
  const [breeds, setBreeds] = useState<IBreed[]>([])
  const [loadingBreeds, setLoadingBreeds] = useState<boolean>(true)
  const [selectedBreed, setSelectedBreed] = useState<string>('')
  const [loadingCat, setLoadingCat] = useState<boolean>(false)

  useEffect(() => {
    if (sessionStorage.cat_breeds) {
      setLoadingBreeds(false)
      setBreeds(JSON.parse(sessionStorage.cat_breeds))
    } else {
      getAllBreeds()
    }
  }, [])

  const getAllBreeds = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/cats/breeds`)
      if (res.status !== 200) return
      setBreeds(res.data)
      sessionStorage.setItem('cat_breeds', JSON.stringify(res.data))
    } catch (error) {
    } finally {
      setLoadingBreeds(false)
    }
  }

  const getSpecificCat = async (breed: string) => {
    setLoadingCat(true)
    setCurrentCat(null)
    try {
      const res = await axios.get(`${apiUrl}/api/cats/breeds/${breed}`)
      if (res.status !== 200) return
      setCurrentCat(res.data[0])
    } catch (error) {
    } finally {
      setLoadingCat(false)
    }
  }

  const handleChange = (value: string) => {
    setSelectedBreed(value)
  }

  return (
    <>
      <Select
        placeholder='Select a breed'
        onChange={handleChange}
        loading={loadingBreeds}
        style={{ width: '180px', margin: '10px' }}
      >
        {breeds.map(({ name, id }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
      {selectedBreed && (
        <Button loading={loadingCat} onClick={() => getSpecificCat(selectedBreed)}>
          Show specific cat
        </Button>
      )}
    </>
  )
}
