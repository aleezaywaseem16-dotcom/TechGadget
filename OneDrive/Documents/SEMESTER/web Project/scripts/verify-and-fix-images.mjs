import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRODUCTS = [

  // ── SMARTPHONES ──────────────────────────────────────────
  { slug: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-2.jpg',
    'https://cdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg',
  ]},
  { slug: 'iphone-15', name: 'iPhone 15', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-2.jpg',
  ]},
  { slug: 'samsung-galaxy-a56', name: 'Samsung Galaxy A56', urls: [
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-2.jpg',
  ]},
  { slug: 'samsung-galaxy-s21-ultra', name: 'Samsung Galaxy S21 Ultra', urls: [
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-2.jpg',
  ]},
  { slug: 'samsung-galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra', urls: [
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-2.jpg',
  ]},
  { slug: 'samsung-galaxy-z-fold-6', name: 'Samsung Galaxy Z Fold 6', urls: [
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-2.jpg',
  ]},
  { slug: 'google-pixel-9-pro', name: 'Google Pixel 9 Pro', urls: [
    'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-2.jpg',
  ]},
  { slug: 'nothing-phone-2a', name: 'Nothing Phone 2a', urls: [
    'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-2.jpg',
  ]},
  { slug: 'oneplus-13', name: 'OnePlus 13', urls: [
    'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-13-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-13-2.jpg',
  ]},
  { slug: 'xiaomi-14t-pro', name: 'Xiaomi 14T Pro', urls: [
    'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14t-pro-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14t-pro-2.jpg',
  ]},
  { slug: 'sony-xperia-1-vii', name: 'Sony Xperia 1 VII', urls: [
    'https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-1-vii-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-1-vii-2.jpg',
  ]},
  { slug: 'iphone-14', name: 'iPhone 14', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-2.jpg',
  ]},

  // ── LAPTOPS ──────────────────────────────────────────────
  { slug: 'macbook-air-13-m3', name: 'MacBook Air 13 M3', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-13-2024-1.jpg',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  ]},
  { slug: 'macbook-pro-16-m4-pro', name: 'MacBook Pro 16 M4 Pro', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-16-2024-1.jpg',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  ]},
  { slug: 'dell-xps-15', name: 'Dell XPS 15', urls: [
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=800&q=80',
  ]},
  { slug: 'asus-rog-zephyrus-g16', name: 'ASUS ROG Zephyrus G16', urls: [
    'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=800&q=80',
    'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=800&q=80',
  ]},
  { slug: 'hp-spectre-x360-14', name: 'HP Spectre x360', urls: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
  ]},
  { slug: 'lenovo-thinkpad-x1-carbon-gen12', name: 'Lenovo ThinkPad X1', urls: [
    'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  ]},

  // ── GAMING ───────────────────────────────────────────────
  { slug: 'razer-blackwidow-v4-pro', name: 'Razer BlackWidow V4 Pro', urls: [
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
  ]},
  { slug: 'logitech-g915-tkl-wireless', name: 'Logitech G915 TKL', urls: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
  ]},
  { slug: 'razer-deathadder-v3-pro', name: 'Razer DeathAdder V3 Pro', urls: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  ]},
  { slug: 'logitech-g-pro-x-superlight-2', name: 'Logitech G Pro X Superlight 2', urls: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  ]},
  { slug: 'razer-kraken-v3-hypersense', name: 'Razer Kraken V3', urls: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  ]},
  { slug: 'steelseries-arctis-nova-pro-wireless', name: 'SteelSeries Arctis Nova Pro', urls: [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
  ]},

  // ── SMART WATCHES ────────────────────────────────────────
  { slug: 'samsung-galaxy-watch-7', name: 'Samsung Galaxy Watch 7', urls: [
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch7-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch7-2.jpg',
  ]},
  { slug: 'apple-watch-series-10', name: 'Apple Watch Series 10', urls: [
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-10-1.jpg',
    'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-10-2.jpg',
  ]},
  { slug: 'garmin-fenix-8-solar', name: 'Garmin Fenix 8 Solar', urls: [
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
  ]},
  { slug: 'xiaomi-smart-band-9-pro', name: 'Xiaomi Smart Band 9 Pro', urls: [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
  ]},

  // ── AUDIO DEVICES ────────────────────────────────────────
  { slug: 'apple-airpods-pro-2nd-gen', name: 'Apple AirPods Pro 2nd Gen', urls: [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
    'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=800&q=80',
  ]},
  { slug: 'sony-wf-1000xm5', name: 'Sony WF-1000XM5', urls: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=800&q=80',
  ]},
  { slug: 'jbl-charge-5', name: 'JBL Charge 5', urls: [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80',
  ]},
  { slug: 'bose-soundlink-max', name: 'Bose SoundLink Max', urls: [
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  ]},
  { slug: 'sony-wh-1000xm6', name: 'Sony WH-1000XM6', urls: [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  ]},
  { slug: 'bose-quietcomfort-45', name: 'Bose QuietComfort 45', urls: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  ]},
]

async function isRealImage(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechGadget/1.0)' },
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) return false
    const type = res.headers.get('content-type') || ''
    const size = parseInt(res.headers.get('content-length') || '0')
    const isImage = type.includes('image/jpeg') || type.includes('image/png') || type.includes('image/webp')
    const isBigEnough = size === 0 || size > 5000
    return isImage && isBigEnough
  } catch {
    return false
  }
}

async function findWorkingUrls(product) {
  const working = []
  for (const url of product.urls) {
    if (working.length >= 2) break
    process.stdout.write(`  Testing ${url.substring(0, 70)}... `)
    const ok = await isRealImage(url)
    if (ok) {
      console.log('✓ GOOD')
      working.push(url)
    } else {
      console.log('✗ FAIL')
    }
  }
  return working
}

async function main() {
  const { data: dbProducts } = await supabase.from('products').select('id, slug')
  const productMap = Object.fromEntries(dbProducts.map(p => [p.slug, p.id]))

  const failed = []
  const succeeded = []

  for (const product of PRODUCTS) {
    const productId = productMap[product.slug]
    if (!productId) {
      console.log(`\nSKIP: ${product.slug} not in DB`)
      continue
    }

    console.log(`\n[${product.name}]`)
    const workingUrls = await findWorkingUrls(product)

    if (workingUrls.length === 0) {
      console.log(`  ✗ NO working URLs — keeping existing images`)
      failed.push(product.slug)
      continue
    }

    await supabase.from('product_images').delete().eq('product_id', productId)

    for (let i = 0; i < workingUrls.length; i++) {
      await supabase.from('product_images').insert({
        product_id: productId,
        url: workingUrls[i],
        alt: `${product.name} image ${i + 1}`,
        position: i + 1
      })
    }

    console.log(`  ✓ Saved ${workingUrls.length} verified image(s) to DB`)
    succeeded.push(product.slug)
  }

  console.log('\n========================================')
  console.log(`✓ Fixed: ${succeeded.length} products`)
  console.log(`✗ No working URLs: ${failed.length} products`)
  if (failed.length > 0) console.log('Failed:', failed.join(', '))
  console.log('========================================')
}

main().catch(console.error)
