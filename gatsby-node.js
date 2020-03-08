const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { fmImagesToRelative } = require("gatsby-remark-relative-images")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const comicPage = path.resolve(`./src/templates/comic.js`)
  const tagPage = path.resolve(`./src/templates/tag.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const comics = result.data.allMarkdownRemark.edges
  const tags = [
    ...new Set(comics.map(comic => comic.node.frontmatter.tags).flat()),
  ]

  tags.forEach(tag => {
    createPage({
      path: `tags/${tag}`,
      component: tagPage,
      context: {
        tag,
      },
    })
  })

  comics.forEach((comic, index) => {
    const previous = index === comics.length - 1 ? null : comics[index + 1].node
    const next = index === 0 ? null : comics[index - 1].node

    createPage({
      path: comic.node.fields.slug,
      component: comicPage,
      context: {
        slug: comic.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node)

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      description: String
    }
  `
  createTypes(typeDefs)
}
