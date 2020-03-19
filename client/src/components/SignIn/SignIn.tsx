import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Modal } from 'antd'
import { ROUTES } from '../../constants'
import AuthContext from '../../context/auth/AuthContext'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export default function SignIn(): JSX.Element {
  const history = useHistory()
  const { error, loginUser, isAuthenticated, isSubmitting } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      history.push(ROUTES.viewCatPage)
    }
    if (error) {
      Modal.error({ title: error })
    }
  }, [error, isAuthenticated])

  const onFinish = (values: object) => {
    loginUser(values)
  }

  return (
    <Form {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
      <Form.Item
        label='Email'
        name='email'
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input type='email' />
      </Form.Item>

      <Form.Item
        label='Password'
        name='password'
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={isSubmitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
