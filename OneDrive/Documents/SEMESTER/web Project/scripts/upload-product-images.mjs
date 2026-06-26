import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
  {
    slug: 'samsung-galaxy-s21-ultra',
    id: '07c1592e-3b2e-42b9-89e8-f986bc2e9c39',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg', filename: 'samsung-s21-ultra-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-2.jpg', filename: 'samsung-s21-ultra-2.jpg' },
    ]
  },
  {
    slug: 'samsung-galaxy-s25-ultra',
    id: '077ba1c5-7a98-4d00-9a12-a397d4b4a8f0',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg', filename: 'samsung-s25-ultra-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-2.jpg', filename: 'samsung-s25-ultra-2.jpg' },
    ]
  },
  {
    slug: 'samsung-galaxy-a56',
    id: '8ab53019-2f63-451c-a8b0-95809290c7d7',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-1.jpg', filename: 'samsung-a56-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-2.jpg', filename: 'samsung-a56-2.jpg' },
    ]
  },
  {
    slug: 'google-pixel-9-pro',
    id: 'c8cf8633-066d-45ff-98e2-9e34867bfdcd',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg', filename: 'pixel-9-pro-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-2.jpg', filename: 'pixel-9-pro-2.jpg' },
    ]
  },
  {
    slug: 'nothing-phone-2a',
    id: '679b7c0e-7c23-4dab-a01d-5b9ae85788f3',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-1.jpg', filename: 'nothing-2a-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-2.jpg', filename: 'nothing-2a-2.jpg' },
    ]
  },
  {
    slug: 'iphone-16-pro-max',
    id: '5fc18449-e43e-440d-906a-e852c0c759a6',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg', filename: 'iphone-16-pro-max-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-2.jpg', filename: 'iphone-16-pro-max-2.jpg' },
    ]
  },
  {
    slug: 'iphone-15',
    id: '1d02783d-1c1a-4c89-8817-79dfd26c90e7',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg', filename: 'iphone-15-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-2.jpg', filename: 'iphone-15-2.jpg' },
    ]
  },
  {
    slug: 'iphone-14',
    id: '1966c291-4bf9-4930-b75b-e031915cbb6d',
    images: [
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg', filename: 'iphone-14-1.jpg' },
      { url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-2.jpg', filename: 'iphone-14-2.jpg' },
    ]
  },
]

async function downloadImage(url, filename) {
  console.log(`Downloading ${filename} from ${url}`)
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechGadget/1.0)' }
  })
  if (!res.ok) {
    console.error(`FAILED to download ${url} — status ${res.status}`)
    return null
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  if (!existsSync('tmp')) mkdirSync('tmp')
  const path = join('tmp', filename)
  writeFileSync(path, buffer)
  console.log(`Saved ${filename} (${buffer.length} bytes)`)
  return { path, buffer }
}

async function uploadToSupabase(buffer, filename, productSlug) {
  const storagePath = `products/${productSlug}/${filename}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    })
  if (error) {
    console.error(`Upload failed for ${filename}:`, error.message)
    return null
  }
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath)
  console.log(`Uploaded: ${data.publicUrl}`)
  return data.publicUrl
}

async function main() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === 'product-images')

  if (!bucketExists) {
    console.log('Creating product-images bucket...')
    const { error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880
    })
    if (error) {
      console.error('Failed to create bucket:', error.message)
      process.exit(1)
    }
  }

  for (const product of products) {
    console.log(`\nProcessing: ${product.slug}`)

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id)

    for (let i = 0; i < product.images.length; i++) {
      const { url, filename } = product.images[i]
      const position = i + 1

      const downloaded = await downloadImage(url, filename)
      if (!downloaded) {
        console.error(`Skipping ${filename} — download failed`)
        continue
      }

      const publicUrl = await uploadToSupabase(downloaded.buffer, filename, product.slug)
      if (!publicUrl) continue

      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          url: publicUrl,
          alt: `${product.slug} image ${position}`,
          position
        })

      if (error) {
        console.error(`DB insert failed for ${filename}:`, error.message)
      } else {
        console.log(`✓ ${product.slug} image ${position} saved`)
      }
    }
  }

  console.log('\nDone! All images uploaded to Supabase Storage.')
}

main().catch(console.error)
