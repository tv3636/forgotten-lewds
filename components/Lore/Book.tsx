import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { AnimatePresence, motion } from "framer-motion";
import { LorePageData } from "./types";
import { typeSetterV2 } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";

const wizData = productionWizardData as { [wizardId: string]: any };

const BookElement = styled.div``;

const Carousel = styled.div`
  box-sizing: border-box;
  position: relative;
  padding: 0 40px;
  @media (max-width: 768px) {
    padding: 0 2px;
  }
`;

const Spread = styled.div<{ bg: string }>`
  display: grid;
  gap: 0px 0px;
  position: relative;

  & > * {
    /* border: 1px solid red; */
  }

  .bg {
    background-color: ${(props) => props.bg};
  }

  grid-template-areas:
    "lefttopcorner topborder1 lefttopbinding  righttopbinding  topborder2 righttopcorner"
    "leftborder    pagebody1  leftpagebinding rightpagebinding pagebody2  rightborder"
    "leftbotcorner botborder1 leftbotbinding  rightbotbinding  botborder2 rightbotcorner";

  // the 300px here is the sum of:
  // top nav + top border row + bottom border row + pagination controls + any padding
  grid-template-rows: 78px minmax(0, min(calc(100vh - 350px), 600px)) 80px;
  grid-template-columns: 69px minmax(0, 1fr) 39px 39px minmax(0, 1fr) 69px;

  @media (max-width: 768px) {
    grid-template-areas:
      "lefttopcorner pagebody1 pagebody1 pagebody1  pagebody1 righttopcorner"
      "leftborder    pagebody1  pagebody1 pagebody1 pagebody1  rightborder"
      "leftborder    pagebody2  pagebody2 pagebody2 pagebody2  rightborder"
      "leftbotcorner botborder1 botborder1  botborder1  botborder1 rightbotcorner";

    grid-template-rows: 74px max-content max-content 74px;

    /* grid-template-columns: 71px minmax(0, 1fr) 52px 0px 0px 0px; */
    /* grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px; */
  }
`;

const LeftTopCorner = styled.div`
  background-image: url("/static/lore/book/slices/corner_top_left.png");
  background-repeat: no-repeat;
  background-position: left top;
  grid-area: lefttopcorner;
`;
const RightTopCorner = styled.div`
  background-image: url("/static/lore/book/slices/corner_top_right.png");
  background-repeat: no-repeat;
  background-position: right top;
  grid-area: righttopcorner;
`;
const LeftBotCorner = styled.div`
  background-image: url("/static/lore/book/slices/corner_bottom_left.png");
  background-repeat: no-repeat;
  background-position: left top;
  grid-area: leftbotcorner;
`;
const RightBotCorner = styled.div`
  background-image: url("/static/lore/book/slices/corner_bottom_right.png");
  background-repeat: no-repeat;
  background-position: right top;
  grid-area: rightbotcorner;
`;

const LeftBorder = styled.div`
  background-image: url("/static/lore/book/slices/side_left_tile.png");
  background-repeat: repeat-y;
  background-position: left top;
  grid-area: leftborder;
`;
const RightBorder = styled.div`
  background-image: url("/static/lore/book/slices/side_right_tile.png");
  background-repeat: repeat-y;
  background-position: right top;
  grid-area: rightborder;
`;

const TopBorder1 = styled.div`
  grid-area: topborder1;
  background-image: url("/static/lore/book/slices/top_left_tile.png");
  background-repeat: repeat-x;
  background-position: left top;
`;
const TopBorder2 = styled.div`
  grid-area: topborder2;
  background-image: url("/static/lore/book/slices/top_left_tile.png");
  background-repeat: repeat-x;
  background-position: right top;
`;

const BotBorder1 = styled.div`
  background-image: url("/static/lore/book/slices/bottom_left_tile.png");
  background-repeat: repeat-x;
  background-position: left top;
  grid-area: botborder1;
`;
const BotBorder2 = styled.div`
  background-image: url("/static/lore/book/slices/bottom_right_tile.png");
  background-repeat: repeat-x;
  background-position: right top;
  grid-area: botborder2;
`;

const LeftPageBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_left_tile.png");
  background-position: left top;
  grid-area: leftpagebinding;
`;

const RightPageBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_right_tile.png");
  background-position: right top;
  grid-area: rightpagebinding;
`;

const LeftTopBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_top_left.png");
  background-position: left top;
  grid-area: lefttopbinding;
  border-top-right-radius: 25%;
`;
const RightTopBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_top_right.png");
  background-position: right top;
  grid-area: righttopbinding;
  border-top-left-radius: 25%;
`;

const LeftBotBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_bottom_left.png");
  background-position: left top;
  grid-area: leftbotbinding;
  border-bottom-left-radius: 15%;
`;
const RightBotBinding = styled.div`
  background-image: url("/static/lore/book/slices/center_bottom_right.png");
  background-position: right top;
  grid-area: rightbotbinding;
  border-bottom-right-radius: 15%;
`;

const PreviousPageBody = styled(motion.div)`
  position: relative;
`;
const NextPageBody = styled(motion.div)`
  position: relative;
`;

const PageBody1 = styled(motion.div)`
  grid-area: pagebody1;
  position: relative;
`;
const PageBody2 = styled(motion.div)`
  grid-area: pagebody2;
  position: relative;
`;

const PageBodyFront = styled(motion.div)`
  background-color: green;
`;
const PageBodyBack = styled(motion.div)`
  background-color: green;
`;

export type Props = {
  wizardId: string;
  page: string;
  lorePageData: LorePageData;
};

const Book = ({ wizardId, page, lorePageData }: Props) => {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  const { components, previousPageRoute, nextPageRoute } = typeSetterV2({
    wizardId,
    pageNum: parseInt(page),
    lorePageData: lorePageData,
  });

  const { previousPage, currentLeftPage, currentRightPage, nextPage } =
    components;

  return (
    <BookElement>
      <Carousel>
        <Spread bg={bg}>
          <LeftTopCorner />
          <TopBorder1 />
          <LeftTopBinding className="bg" />
          <RightTopBinding className="bg" />
          <TopBorder2 />
          <RightTopCorner />

          <LeftBorder />
          <PageBody1>{currentLeftPage}</PageBody1>
          <LeftPageBinding className="bg" />
          <RightPageBinding className="bg" />
          <PageBody2
          // initial={{ rotateY: 0, left: 0 }}
          // exit={{ rotateY: -180, left: "calc(-100% - 8vw - 4px)" }}
          // transition={{ duration: 1 }}
          // key={layoutId}
          // layoutId={layoutId}
          >
            <AnimatePresence>{currentRightPage}</AnimatePresence>
          </PageBody2>
          <RightBorder />

          <LeftBotCorner />
          <BotBorder1 />
          <LeftBotBinding className="bg" />
          <RightBotBinding className="bg" />
          <BotBorder2 />
          <RightBotCorner />
        </Spread>
      </Carousel>
      <BookOfLoreControls
        wizardId={wizardId as string}
        page={page as string}
        previousPageRoute={previousPageRoute}
        nextPageRoute={nextPageRoute}
      />
    </BookElement>
  );
};

export default Book;
