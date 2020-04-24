import React, { useContext } from "react";
import { Grid, TransitionGroup } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm></PostForm>
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts</h1>
        ) : (
          <TransitionGroup>
            {data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </TransitionGroup>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
