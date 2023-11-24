import RootAPI from "./API/RootAPI";

const handleImgLink = (link) => {
  if (link?.includes(`images`)) {
    link = RootAPI +'/' + link;
  }

  return link;
};

export default handleImgLink;
