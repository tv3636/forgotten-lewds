import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

import ReactMarkdown, { uriTransformer } from "react-markdown";
import { WriteButton } from "./BookOfLoreControls";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { loreTextStyles } from "./loreStyles";
import { getContrast } from "../../lib/colorUtils";
import { IPFS_SERVER } from "../../constants";
import {
  isSoulsContract,
  isWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

const imageUrls: any = {
  "0x9690b63eb85467be5267a3603f770589ab12dc95": "https://portal.forgottenrunes.com/api/warriors/img/",
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": "https://portal.forgottenrunes.com/api/shadowfax/img/",
  "0x8634c23d5794ed177e9ffd55b22fdb80a505ab7b": "https://portal.forgottenrunes.com/api/beasts/img/",
  "0x7de11a2d9e9727fa5ead3094e40211c5e9cf5857": "https://portal.forgottenrunes.com/api/spawn/img/",
};

export const TextPage = styled.div<{
  alignSelf?: string;
  alignChildren?: string;
}>`
  color: #e1decd;
  font-size: 24px;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
  align-self: ${(props) => props.alignSelf || "flex-start"};

  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;

  ${(props) => {
    if (props.alignChildren === "center") {
      return `
      align-items: center;
      /* height: 100%; */
      min-height: 100%;
      justify-content: center;
      `;
    }
  }}

  width: 100%;
  ${loreTextStyles};

  img {
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
`;

const LoadingPageText = styled.div``;

type BookOfLorePageProps = {
  bg: string;
  children: any;
};

const BookOfLorePageWrapper = styled(motion.div)<{ bg?: string }>`
  background-color: ${(props) => props.bg || "#000000"};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;

  // Ties to Book
  height: calc(100% + 96px);
  margin: -75px -14px 0 -14px;

  @media (max-width: 768px) {
    height: calc(100% + 23px);
    margin: 0px -14px 0 -14px;
  }
`;

export function BookOfLorePage({ bg, children }: BookOfLorePageProps) {
  return <BookOfLorePageWrapper bg={bg}>{children}</BookOfLorePageWrapper>;
}

export const CoreCharacterPage = ({
  tokenId,
  tokenAddress,
}: {
  tokenId: string;
  tokenAddress: string;
}) => {
  let bg;
  let imageUrl;
  if (isWizardsContract(tokenAddress)) {
    const wizardData: any = wizData[tokenId.toString()];
    bg = "#" + wizardData.background_color;
    imageUrl = `https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${tokenId}.png`;
  } else if (isSoulsContract(tokenAddress)) {
    const soulData: any = soulsData[tokenId.toString()];
    bg = "#" + +soulData?.background_color ?? "000000";
    imageUrl = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/${tokenId}.png`;
  } else {
    imageUrl = `${imageUrls[tokenAddress]}${tokenId}.png`;
  }

  return (
    <BookOfLorePage bg={bg as string}>
      <ResponsivePixelImg src={imageUrl} style={{ maxWidth: "480px" }} />
    </BookOfLorePage>
  );
};

export const EmptyLorePage = ({ pageNum }: { pageNum: number }) => {
  const furtherOrAny = pageNum < 1 ? "" : " further";

  const noMoreLore = `No${furtherOrAny} Lore has been recorded...`;

  return (
    <BookOfLorePage bg={"#000000"}>
      <TextPage alignSelf="center" alignChildren="center">
        <ReactMarkdown>{noMoreLore}</ReactMarkdown>
      </TextPage>
    </BookOfLorePage>
  );
};

const IPFS_HTTP_SERVER = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD
  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/fetch/f_auto/${IPFS_SERVER}/`
  : `${IPFS_SERVER}/`;

export default function IndividualLorePage({
  bgColor,
  title,
  story,
}: {
  bgColor: string;
  title?: string;
  story?: string;
}) {
  const textColor = getContrast(bgColor ?? "#000000");
  const Inner = (
    <TextPage style={{ color: textColor }}>
      {story && (
        <ReactMarkdown
          children={story}
          components={{
            pre: ({ node, children, ...props }) => (
              <pre {...props} style={{ whiteSpace: "pre-line" }}>
                {children}
              </pre>
            ),
            p: ({ node, children, ...props }) => (
              <p {...props} style={{ wordWrap: "break-word" }}>
                {children}
              </p>
            ),
            img: ({ node, src, ...props }) => {
              let fallbackSrc: string;
              let newSrc: string;
              if (src?.startsWith("ipfs://")) {
                newSrc = src.replace(/^ipfs:\/\//, IPFS_HTTP_SERVER);
                // We fall back to IPFS CDN if we get error (e.g. in case being over limit with Cloudinary)
                fallbackSrc = src.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
              } else if (src?.startsWith("data")) {
                newSrc = src;
                fallbackSrc = src;
              } else {
                newSrc = uriTransformer(src as string);
                fallbackSrc = newSrc;
              }

              const [imgSrc, setImgSrc] = useState<string>(newSrc);
              const onError = () => setImgSrc(fallbackSrc);
              return <img {...props} src={imgSrc} onError={onError} />;
            },
          }}
        />
      )}
    </TextPage>
  );

  return <BookOfLorePage bg={bgColor}>{Inner}</BookOfLorePage>;
}
