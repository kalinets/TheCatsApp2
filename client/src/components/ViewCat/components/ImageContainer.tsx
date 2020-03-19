import React from 'react'

type Props = {
  height: number
  width: number
  url: string
}

export default function ImageContainer(props: Props) {
  const { height, width, url } = props
  return (
    <div className='image-container' style={{ paddingTop: (height / width) * 100 + '%' }}>
      {url && <img src={url} />}
    </div>
  )
}
