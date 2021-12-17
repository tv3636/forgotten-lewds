import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../components/Layout";
import BookCover from "../components/Lore/BookCover";
import LoreSharedLayout from "../components/Lore/LoreSharedLayout";
import OgImage from "../components/OgImage";
import { GetStaticPropsContext } from "next";
import {
  bustLoreCache,
  getWizardsWithLore,
} from "../components/Lore/loreSubgraphUtils";
import { useMedia } from "react-use";
import { useState } from "react";

const WizardMapLeaflet = dynamic(
  () => import("../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const BookOfLoreIndexPage = ({ wizardsWithLore }: { wizardsWithLore: any }) => {
  const isWide = useMedia("(min-width: 900px)");
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  function handleClick(val: boolean) {
    setChecked(true);
    setShow(val);
  }

  if (!checked) {
    return (
      <Layout title={`The Forgotten Runes NSFW Book of Lore`}>
        <div style={{"display": "flex", "alignContent": "center", "alignItems": "center", "flexDirection": "column"}}>
        <div style={{"textAlign": "center", "marginTop": "30vh"}}>This site has adult content. 
          Are you at least 18 years old?</div>
        <div style={{"display": "flex", "flexDirection": "row", "marginTop": "2vh"}}>
        <button style={{"marginRight": "1vh"}} onClick={() => handleClick(true)}>Yes</button>
        <button style={{"marginLeft": "1vh"}} onClick={() => handleClick(false)}>No</button>
        </div>
        </div>
      </Layout>
    )
  } else if (show) {
    return (
      <Layout title={`The Forgotten Runes NSFW Book of Lore`}>
        <OgImage
          title={`The NSFW Book of Lore`}
          images={
            "https://www.forgottenrunes.com/static/lore/book/closed_whole.png"
          }
        />

        <Global
          styles={css`
            html,
            body {
              /* background: radial-gradient(#3c324c, #0a080c); */
            }
          `}
        />
        <LoreSharedLayout>
          <BookCover />
        </LoreSharedLayout>
      </Layout>
    );
  } else {
    return (
      <Layout title={`The Forgotten Runes NSFW Book of Lore`}>
      </Layout>
    )
  }
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      wizardsWithLore: await getWizardsWithLore(),
    },
    revalidate: 5 * 60,
  };
}

export default BookOfLoreIndexPage;
