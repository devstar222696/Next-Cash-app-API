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

  /**
   * Opens the main website in a new tab.
   */
  const handleOpenInBrowser = () => {
    window.open(homeUrl, '_blank')
  }

  /**
   * Copies the homeUrl to the clipboard.
   */
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
    <div
      className="
        flex flex-col items-center justify-center
        min-h-screen w-full
        bg-white text-black
        px-6 py-10
        sm:px-8 md:px-12
        overflow-y-auto
      "
    >
      <div className="flex justify-center">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="Island House Logo"
            className="mb-2"
          />
        </div>

      {/* Instructions Container */}
      <div className="w-full max-w-xl flex flex-col space-y-8">
        {/* 1. Google Login */}
        <div className="p-6 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">1. Google Login</h3>
            <Image
              src="/googlelogin.png"
              width={300}
              height={50}
              alt="Google Login"
              className="object-contain w-[180px] sm:w-[220px] h-auto"
            />
          </div>
          <p className="mb-4 text-base leading-relaxed">
            Google login may not work in the Facebook/Instagram in-app browser. We{' '}
            <strong className="font-semibold">strongly recommend using Chrome browser</strong> for Google login.
          </p>
          <p className="mb-2 text-base">
            Two ways to open the link in an external browser (e.g., Chrome):
          </p>
          <ol className="mb-4 ml-5 list-decimal space-y-2 text-base">
            <li>Copy the URL and paste it into Chrome browser.</li>
            <li>
              Use <strong>"Open in external browser"</strong> from your Facebook/Instagram app menu if available.
            </li>
          </ol>

          {/* Modal Trigger */}
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <Button variant="link" className="p-0 text-base underline" handleClick={function (event: React.MouseEvent<HTMLButtonElement>): void {
                throw new Error('Function not implemented.')
              } }>
                Learn more about opening in an external browser
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              {/* Modal Overlay (centers the modal) */}
              <Dialog.Overlay
                className="
                  fixed inset-0
                  bg-black/50
                  flex items-center justify-center
                  z-50
                "
              >
                {/* Modal Content */}
                <Dialog.Content
                  className="
                    relative
                    w-full max-w-md
                    bg-white text-black
                    rounded-md shadow-lg
                    max-h-[80vh]
                    overflow-y-auto
                    p-0
                  "
                >
                  {/* Sticky Header (Title + Close Button) */}
                  <div
                    className="
                      sticky top-0 left-0
                      flex items-center justify-between
                      bg-white
                      p-4
                      border-b border-gray-200
                      z-50
                    "
                  >
                    <Dialog.Title className="text-xl font-bold">
                      Open in External Browser
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="
                          text-2xl font-bold
                          leading-none
                          text-black
                          hover:text-gray-700
                        "
                        aria-label="Close"
                      >
                        X
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Scrollable Modal Body */}
                  <div className="p-4 space-y-6">
                    {/* Android Instructions */}
                    <div>
                      <h4 className="mb-2 text-lg font-semibold">Android Users</h4>
                      <Image
                        src="/android1.png"
                        width={500}
                        height={500}
                        alt="Android Instructions 1"
                        className="mx-auto w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-md"
                      />
                      <Image
                        src="/android2.png"
                        width={500}
                        height={500}
                        alt="Android Instructions 2"
                        className="mx-auto mt-2 w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-md"
                      />
                    </div>

                    {/* iPhone Instructions */}
                    <div>
                      <h4 className="mb-2 text-lg font-semibold">iPhone (iOS) Users</h4>
                      <Image
                        src="/iphone1.jpg"
                        width={500}
                        height={500}
                        alt="iPhone Instructions"
                        className="mx-auto w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-md"
                      />
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Copy Link Section */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              handleClick={handleCopyLink}
              variant="default"
              className="bg-black text-white hover:bg-gray-900 px-4 py-2"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            {copied && (
              <span className="inline-flex items-center text-base text-green-600">
                <ClipboardCopyIcon className="w-5 h-5 mr-1" />
                Link copied!
              </span>
            )}
          </div>
        </div>
      </div>



      {/* Extra Bottom Spacing if needed */}
      <div className="mt-8" />
      <div className="w-full max-w-xl mx-auto mb-8">
        <Button
          handleClick={handleOpenInBrowser}
          variant="default"
          className="w-full py-6 text-2xl font-semibold text-white bg-black rounded-md shadow hover:bg-gray-900"
        >
          Go to Website
        </Button>
      </div>
    </div>
  )
}