import React from "react";
import { Grid } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import PostCard from "../components/PostCard";

const Home = () => {
  const { loading, data } = useQuery(FET_POST_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading Posts</h1>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

const FET_POST_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        body
        createdAt
        id
        username
      }
    }
  }
`;

export default Home;
