import { h, Component } from "preact"
import img from 'img'
import { join } from 'path'

export const popularIcons = {
  'facebook.com': 'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/N4H_50KFp8i.png',
  'twitter.com': 'https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/icon-ios.a9cd885bccbcaf2f.png',
  'youtube.com': 'https://www.youtube.com/yts/img/favicon_96-vflW9Ec0w.png',
  'amazon.com': 'https://images-na.ssl-images-amazon.com/images/G/01/anywhere/a_smile_120x120._CB368246573_.png',
  'google.com': 'https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png',
  'yahoo.com': 'https://www.yahoo.com/apple-touch-icon-precomposed.png',
  'reddit.com': 'https://www.redditstatic.com/mweb2x/favicon/120x120.png',
  'instagram.com': 'https://www.instagram.com/static/images/ico/apple-touch-icon-120x120-precomposed.png/004705c9353f.png',
  'getkozmos.com': 'https://getkozmos.com/public/logos/kozmos-heart-logo-100px.png',
  'github.com': 'https://assets-cdn.github.com/pinned-octocat.svg',
  'gist.github.com': 'https://assets-cdn.github.com/pinned-octocat.svg',
  'mail.google.com': 'https://www.google.com/images/icons/product/googlemail-128.png',
  'paypal.com': 'https://www.paypalobjects.com/webstatic/icon/pp144.png',
  'imdb.com': 'http://ia.media-imdb.com/images/G/01/imdb/images/desktop-favicon-2165806970._CB522736561_.ico',
  'en.wikipedia.org': 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  'wikipedia.org': 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  'espn.com': 'http://a.espncdn.com/favicon.ico',
  'twitch.tv': 'https://static.twitchcdn.net/assets/favicon-75270f9df2b07174c23ce844a03d84af.ico',
  'cnn.com': 'http://cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png',
  'office.com': 'https://seaofficehome.msocdn.com/s/7047452e/Images/favicon_metro.ico',
  'bankofamerica.com': 'https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-global-favicon-favicon-CSX386b332d.ico',
  'chase.com': 'https://www.chase.com/etc/designs/chase-ux/favicon-152.png',
  'nytimes.com': 'https://static01.nyt.com/images/icons/ios-ipad-144x144.png',
  'apple.com': 'https://www.apple.com/favicon.ico',
  'wellsfargo.com': 'https://www.wellsfargo.com/assets/images/icons/apple-touch-icon-120x120.png',
  'yelp.com': 'https://s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico',
  'wordpress.com': 'http://s0.wp.com/i/webclip.png',
  'dropbox.com': 'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico',
  'mail.superhuman.com': 'https://superhuman.com/build/71222bdc169e5906c28247ed5b7cf0ed.share-icon.png'
}

export default class URLImage extends Component {
  componentWillReceiveProps(props) {
    if (this.props.content.url !== props.content.url) {
      this.refreshSource(props.content)
    }
  }

  componentWillMount() {
    this.refreshSource()
  }

  refreshSource(content) {
    this.findSource(content)
    this.preload(this.state.src)
  }

  findSource(content) {
    content || (content = this.props.content)

    if (!this.props['icon-only'] && content.images && content.images.length > 0) {
      return this.setState({
        type: 'image',
        src: content.images[0]
      })
    }

    if (content.icon) {
      return this.setState({
        type: 'icon',
        src: absoluteIconURL(content)
      })
    }

    const hostname = findHostname(content.url)
    if (popularIcons[hostname]) {
      return this.setState({
        type: 'popular-icon',
        src: popularIcons[hostname]
      })
    }

    this.setState({
      type: 'favicon',
      src: 'http://' + hostname + '/favicon.ico'
    })
  }

  preload(src) {
    if (this.state.loading) {
      console.log('already loading', this.props.content.url, this.state.loadingSrc, src)
      return
    }

    this.setState({
      loading: true,
      loadingSrc: src,
      src: this.cachedIconURL()
    })

    img(src, err => {
      if (err) {
        console.error('Image failed to load. src: %s url: %s', src, err)

        return this.setState({
          loading: false,
          src: this.cachedIconURL()
        })
      }

      this.setState({
        src: src,
        loading: false
      })
    })
  }

  render() {
    const style = {
      backgroundImage: `url(${this.state.src})`
    }

    return (
      <div className={`url-image ${this.state.type}`} style={style}></div>
    )
  }

  cachedIconURL() {
    return 'chrome://favicon/size/72/' + findProtocol(this.props.content.url) + '://' + findHostname(this.props.content.url)
  }

}

function absoluteIconURL (like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon
  return 'http:\/\/' + join(findHostname(like.url), like.icon)
}

export function findHostname(url) {
  return url.replace(/^\w+:\/\//, '').split('/')[0].replace(/^www\./, '')
}

export function findProtocol(url) {
  if (!/^https?:\/\//.test(url)) return 'http'
  return url.split('://')[0]
}