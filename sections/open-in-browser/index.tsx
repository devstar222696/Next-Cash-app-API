



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

const siteUrl = 'islandhouseonline.com'
const navigationUrls = {
  android: `intent://${siteUrl}#Intent;scheme=https;package=com.android.chrome;end`,
  ios: `x-safari-https://${siteUrl}`,

}

export default function OpenInBrowserPage() {
  const [copied, setCopied] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  // const [deviceInfo, setDeviceInfo] = React.useState({
  //   isAndroid: false,
  //   isIOS: false,
  //   isInstagram: false,
  //   isFacebook: false,
  // })

    // We only do detection client-side
    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent || navigator.vendor || '';
        const deviceInfo = {
          // Detect Android or iOS
          isAndroid: /Android/i.test(userAgent),
          isIOS: /iPhone|iPad|iPod/i.test(userAgent),
          // Detect Facebook in-app browser
          // Usually indicated by FBAN or FBAV, etc.
          isFacebook: /FBAN|FBAV|FB_IAB|FBIOS|FBANDROID/i.test(userAgent),
          // Detect Instagram in-app browser
          isInstagram: /Instagram/i.test(userAgent),
        }

        const isInAppBrowser = deviceInfo.isFacebook || deviceInfo.isInstagram
        let url = siteUrl
        if (isInAppBrowser && deviceInfo.isAndroid) {
          url = navigationUrls.android
        }
        
        if (isInAppBrowser && deviceInfo.isIOS) {
          url = navigationUrls.ios
        }

        window.location.replace(url)
        // setDeviceInfo()
      }
    }, [])


  const homeUrl = 'https://www.islandhouseonline.com'

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
        flex flex-col items-center
        min-h-screen w-full
        bg-white text-black
        px-6 py-10
      "
    >
      {/* Top Logo */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="Island House Logo"
        className="object-contain mb-4"
      />

      {/* Bottom Text */}
      <div className="mt-auto text-center text-sm text-gray-600">
        Open the main homepage via Chrome browser
      </div>
      <div className="mt-8" />
      <div className="w-full max-w-xl mx-auto mb-8">
      <a href="intent://islandhouseonline.com#Intent;scheme=https;package=com.android.chrome;end">
              Open in Chrome
      </a>
      <a href="x-safari-https://www.islandhouseonline.com">
              Open in Safari
      </a>
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




