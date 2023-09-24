import AntarcticPeninsula from "./AntarcticPeninsula.webp";
import BlizzardWorld from "./BlizzardWorld.webp";
import Busan from "./Busan.webp";
import CircuitRoyal from "./CircuitRoyal.webp";
import Colosseo from "./Colosseo.webp";
import control from "./Control.webp"; // TODO: Find new image, it looks very transparent
import Dorado from "./Dorado.webp";
import Eichenwalde from "./Eichenwalde.webp";
import escort from "./Escort.webp";
import Esparanca from "./Esparanca.webp";
import flashpoint from "./FlashPoint.png";
import Havana from "./Havana.webp";
import Hollywood from "./Hollywood.webp";
import hybrid from "./Hybrid.webp";
import KingsRow from "./KingsRow.webp";
import Ilios from "./Ilios.webp";
import LijiangTower from "./LijiangTower.webp";
import Midtown from "./Midtown.webp";
import Nepal from "./Nepal.webp";
import NewJunkCity from "./NewJunkCity.jpg";
import NewQueenStreet from "./NewQueenStreet.webp";
import Numbani from "./Numbani.webp";
import Oasis from "./Oasis.webp";
import Rialto from "./Rialto.webp";
import Route66 from "./Route_66.webp";
import ShambaliMonestary from "./ShambaliMonestary.webp";
import Suravasa from "./Suravasa.webp";
import Paraiso from "./Paraiso.webp";
import WatchpointGibraltar from "./Gibraltar.webp";

const mapLookupAdvanced: MapLookup = {
  control: {
    AntarcticPeninsula,
    Busan,
    control,
    Ilios,
    LijiangTower,
    Nepal,
    Oasis,
  },
  escort: {
    CircuitRoyal,
    Dorado,
    escort,
    Havana,
    Rialto,
    Route66,
    ShambaliMonestary,
    WatchpointGibraltar,
  },
  flashpoint: {
    flashpoint,
    NewJunkCity,
    Suravasa,
  },
  hybrid: {
    BlizzardWorld,
    Eichenwalde,
    Hollywood,
    hybrid,
    KingsRow,
    Midtown,
    Numbani,
    Paraiso,
  },
  push: {
    // TODO: still needs the default push icon, idk where to find. fml send help
    Colosseo,
    Esparanca,
    NewQueenStreet,
  },
};

export default mapLookupAdvanced;
