'use client'

import * as React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/button' 
import { ClipboardCopyIcon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog'

export const metadata: Metadata = {
  title: 'Island House',
  description: 'Island House',
}

export default function OpenInBrowserPage() {
  const [copied, setCopied] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const homeUrl = 'https://www.islandhousesweepstakes.com'

  const handleOpenInBrowser = () => {
    window.open(homeUrl, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-auto bg-gray-50 sm:px-6 md:px-8">
      <div className="flex flex-col items-center max-w-md w-full mx-auto space-y-4">
        <div className="flex justify-center">
          <Image src="/logo.png" width={100} height={100} alt="Island House Logo" className="mb-2" />
        </div>
        <p className="text-base text-center text-gray-600 sm:text-lg">
          If you arrived here from Facebook or Instagram, please follow the steps below to continue.
        </p>
      </div>

      <div className="flex flex-col w-full max-w-md mt-6 space-y-4 mx-auto">
        <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold sm:text-xl text-blue-600">
              1. Google Login Users
            </h3>
            <Image src="/googlelogin.png" width={180} height={30} alt="Google Login" />
          </div>
          <p className="mb-4 text-sm text-gray-700 sm:text-base">
            Google login does not work inside Facebook or Instagram’s in-app browser. We <strong>strongly recommend using Chrome browser</strong> for Google login.
          </p>
          <p className="text-sm text-gray-700 sm:text-base">
            Two options to open the link externally:
          </p>
          <ol className="mb-1 ml-6 text-sm list-decimal text-gray-700 sm:text-base">
            <li className="mb-2">
              Copy the URL and paste it into Chrome browser.
            </li>
            <li>
              Or, tap <strong>"Open in external browser"</strong> if your Facebook/Instagram app provides the option.
            </li>
          </ol>
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <Button variant="link" className="text-sm text-blue-500 underline sm:text-base">
                How to open in external browser
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-white p-6 rounded-md transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-4 text-gray-700">Open in External Browser</Dialog.Title>
                <Image src="/Browser-img.png" width={450} height={450} alt="Instructions for External Browser" className="w-full h-auto mb-4" />
                <Dialog.Close asChild>
                  <Button variant="default" className="mt-2 w-full">
                    Close
                  </Button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <div className="flex items-center gap-3">
            <Button handleClick={handleCopyLink} variant="default" className="text-sm sm:text-base">
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            {copied && (
              <span className="inline-flex items-center text-sm text-green-600 sm:text-base">
                <ClipboardCopyIcon className="w-4 h-4 mr-1" />
                Copied to clipboard
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold sm:text-xl text-green-600">
              2. Email Login Users
            </h3>
            <Image src="/emaillogin.png" width={200} height={30} alt="Email Login" />
          </div>
          <p className="mb-4 text-sm text-gray-700 sm:text-base">
            You can stay in your current in-app browser and proceed directly to the main page to login using your email. However, we still <strong>strongly recommend using Chrome browser</strong> for easy access.
          </p>
          <Button handleClick={handleOpenInBrowser} variant="default" color="green" className="text-sm sm:text-base">
            Go to Website
          </Button>
        </div>
      </div>
    </div>
  )
}