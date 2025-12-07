import React from 'react'
import { Layout } from '../components/Layout'
import { PasswordResetConfirm } from '../components/PasswordResetConfirm'

export function PasswordResetConfirmPage() {
  return (
    <Layout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <PasswordResetConfirm />
      </div>
    </Layout>
  )
}
