import { graphql, Link } from "gatsby"
import Image from "gatsby-image"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class ComicTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const {
      image,
      secondaryImage,
      secondaryImageLink,
      bestOf,
      tonyLazuto,
    } = post.frontmatter
    const bestOfMode = this.props.location.state?.bestOf || bestOf || false
    const tonyLazutoMode =
      this.props.location.state?.tonyLazuto || tonyLazuto || false
    let next, previous
    let section = <></>

    if (bestOfMode) {
      next = this.props.data.nextBestOf.edges[0]?.node
      previous = this.props.data.previousBestOf.edges[0]?.node
    } else if (tonyLazutoMode) {
      next = this.props.data.nextTonyLazuto.edges[0]?.node
      previous = this.props.data.previousTonyLazuto.edges[0]?.node
    } else {
      next = this.props.data.nextArchive.edges[0]?.node
      previous = this.props.data.previousArchive.edges[0]?.node
    }

    if (image) {
      if (!image.childImageSharp && image.extension === "svg") {
        section = (
          <img
            src={image.publicURL}
            alt={post.frontmatter.description}
            title={post.frontmatter.description}
          />
        )
      } else {
        section = (
          <Image
            fluid={image.childImageSharp.fluid}
            alt={post.frontmatter.description}
            title={post.frontmatter.description}
          />
        )
      }
    }

    if (secondaryImage) {
      section = (
        <>
          {section}
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 512 }}>
            <a
              href={secondaryImageLink}
              target={`_blank`}
              rel={`noopener noreferrer`}
            >
              <Image
                fluid={secondaryImage.childImageSharp.fluid}
                style={{
                  display: post.fields.slug === "/he-hath-risen/" ? "none" : "",
                }}
              ></Image>
            </a>
          </div>
        </>
      )
    }

    return (
      <Layout
        location={this.props.location}
        title={siteTitle}
        titleImage={this.props.data.titleImage}
      >
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description}
        />
        <article>
          <header>
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.title}
            </h1>
          </header>
          <section
            style={{
              marginBottom: rhythm(0.5),
            }}
          >
            {section}
          </section>
        </article>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link
                  style={{
                    boxShadow: `none`,
                    textDecoration: `none`,
                    color: `inherit`,
                  }}
                  to={previous.fields.slug}
                  rel="prev"
                  state={{ bestOf: bestOfMode, tonyLazuto: tonyLazutoMode }}
                >
                  <Image
                    fixed={this.props.data.previous.childImageSharp.fixed}
                    alt="Previous"
                  />
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link
                  style={{
                    boxShadow: `none`,
                    textDecoration: `none`,
                    color: `inherit`,
                  }}
                  to={next.fields.slug}
                  rel="next"
                  state={{ bestOf: bestOfMode, tonyLazuto: tonyLazutoMode }}
                >
                  <Image
                    fixed={this.props.data.next.childImageSharp.fixed}
                    alt="Next"
                  />
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default ComicTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $date: Date!) {
    site {
      siteMetadata {
        title
      }
    }
    previous: file(absolutePath: { regex: "/button_Previous.png/" }) {
      childImageSharp {
        fixed(width: 180) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    next: file(absolutePath: { regex: "/button_Next.png/" }) {
      childImageSharp {
        fixed(width: 180) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        description
        bestOf
        tonyLazuto
        image {
          childImageSharp {
            fluid(maxWidth: 854) {
              ...GatsbyImageSharpFluid
            }
          }
          extension
          publicURL
        }
        secondaryImage {
          childImageSharp {
            fluid(maxWidth: 512) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        secondaryImageLink
      }
    }
    nextBestOf: allMarkdownRemark(
      limit: 1
      filter: { frontmatter: { date: { gt: $date }, bestOf: { eq: true } } }
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    previousBestOf: allMarkdownRemark(
      limit: 1
      filter: { frontmatter: { date: { lt: $date }, bestOf: { eq: true } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    nextTonyLazuto: allMarkdownRemark(
      limit: 1
      filter: { frontmatter: { date: { gt: $date }, tonyLazuto: { eq: true } } }
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    previousTonyLazuto: allMarkdownRemark(
      limit: 1
      filter: { frontmatter: { date: { lt: $date }, tonyLazuto: { eq: true } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    nextArchive: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          date: { gt: $date }
          bestOf: { ne: true }
          tonyLazuto: { ne: true }
        }
      }
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    previousArchive: allMarkdownRemark(
      limit: 1
      filter: {
        frontmatter: {
          date: { lt: $date }
          bestOf: { ne: true }
          tonyLazuto: { ne: true }
        }
      }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
    titleImage: file(absolutePath: { regex: "/image_Title.png/" }) {
      childImageSharp {
        fixed(width: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
