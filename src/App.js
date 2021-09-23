import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useWebcamCapture } from "./useWebcamCapture";
import { v1 as uuidv1 } from 'uuid';

// TODO: It would be nice to just import all the icons in the folder, but I tried different approaches with no sucess
import logo from "./slap.png";
import logo2 from "./slap2.png";
import logo3 from "./slap3.png"
import logo4 from "./slap4.png"
import logo5 from "./slap5.png"
import logo6 from "./slap6.png"
import logo7 from "./slap7.png"
import logo8 from "./slap8.png"
import logo9 from "./slap9.png"

import { Link, Switch, Route, Redirect } from "react-router-dom";

const useStyles = createUseStyles((theme) => ({
  "@global body": {
    background: "#eee",
    color: "#fff",
    fontFamily: 'Patrick Hand',
    fontSize: "22px",
  },

  App: {
    padding: "20px",
    background: "#121212",
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    borderRadius: "20px",
    "& a": {
      color: "#fff",
      textDecoration: "none",
      fontSize: "22px"
    },

  },
  Header: {
    "&  h1": {
      fontFamily: 'Gluten',
      cursor: "pointer",
      fontSize: "45px",
      textAlign: "center",
      textShadow: "-1px 1px 0 #347eed, -2px 2px 0 #347eed"
    },

    "& p": {
      textAlign: "center",
    },

    "& ul": {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "18px",
      paddingInlineEnd: "40px"
    },

    "& li": {
      display: "flex",
    },
  },
  Main: {
    background: "#347eed",
    borderRadius: "20px",

    "& canvas": {
      width: "100%",
      height: "auto",
      borderRadius: "20px"
    },
    "& video": {
      display: "none",
    },

    "& p": {
      textAlign: "center",
      marginBottom: "5px",
      fontFamily: 'Gluten',
      fontSize: "20px"
    },
  },
  Stickers: {
    "& img": {
      height: "4rem",
      borderRadius: "20px",
      marginLeft: "10px",
      backgroundColor: "#ffff",
      width: "60px"

    },

    "& p": {
      textAlign: "center",
      fontFamily: 'Gluten',
      fontSize: "20px"
    },

    "& button": {
      border: "none",
      marginTop: "20px",
      marginBottom: "20px",
      display: "inline-block",
      backgroundColor: "transparent"
    }
  },
  Gallery: {
    marginTop: "20px",
    "& img": {
      height: "11rem",
      borderRadius: "20px",
      width: "100%"
    },

    "& p": {
      textAlign: "center",
      marginBottom: "5px",
      fontFamily: 'Gluten',
      fontSize: "20px"
    },

    "& a": {
      marginLeft: "5px",
    },

    "& li": {
      display: "flex",
      marginRight: "22px",
      justifyContent: "center"
    },

    "& input": {
      display: "flex",
      marginTop: "20px",
      marginBottom: "20px",
      borderRadius: "20px",
      border: "2px solid #2B4F6C",
      fontFamily: 'Gluten',
      marginRight: "auto",
      marginLeft: "auto",
      outline: "transparent",
      textAlign: "center",
      backgroundImage: "linear-gradient(#92baf5, #639cf1)",
      textShadow: "-1px 1px 0 #347eed, -2px 2px 0 #347eed",

    }
  },
  Picture: {
    background: "black",
    padding: 4,
    position: "relative",
    display: "inline-block",
    borderRadius: "20px",
    "& h3": {
      padding: 8,
      textAlign: "center",
      width: "100%",
    },

  },

  SavedGallery: {
    "& img": {
      height: "auto",
      borderRadius: "20px",
      width: "100%",
      marginBottom: "20px",
      display: "block"
    },

    "& li": {
      display: "flex",
    },

    "& ul": {
      paddingInlineStart: "0px",
      position: "relative"
    },

    "& a": {
      position: "absolute",
      paddingTop: "10px",
      right: "20px"
    }
  },
}));


/*Let users pick from multiple (custom) stickers*/
var stickers = [];

stickers.push([logo].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo2].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo3].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo4].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo5].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo6].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo7].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo8].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

stickers.push([logo9].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
}));

function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);
  // currently active sticker
  const [sticker, setSticker] = useState();
  // title for the picture that will be captured
  const [title, setTitle] = useState("SLAPPE!");
  // enable or disable save photo button to avoid that the same photo is saved multiple times
  const [enableSavePhoto, setEnableSavePhoto] = useState(true);
  // photo gallery saved by the user
  const [photoGallery, setPhotoGallery] = useState([]);

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    picture, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);

  function getPhotoGalleryFromStorage() {
    let photoGalleryTemp = JSON.parse(sessionStorage.getItem('slap-sticker-gallery'));

    if (photoGalleryTemp == undefined) {
      photoGalleryTemp = new Array();
    }

    return photoGalleryTemp;
  }

  function persistPhotoGalery(photoGalleryTemp) {
    try {
      console.log(photoGalleryTemp);
      sessionStorage.setItem('slap-sticker-gallery', JSON.stringify(photoGalleryTemp));
      setPhotoGallery(photoGalleryTemp);
    } catch (error) {
      alert("There are too many pictures in your gallery. Delete some to continue");
      setEnableSavePhoto(true);
    }
  }

  function savePhotoToGallery(e) {
    e.preventDefault();
    setEnableSavePhoto(false);
    let photoGalleryTemp = getPhotoGalleryFromStorage();

    picture.id = uuidv1();
    photoGalleryTemp.push(picture);

    persistPhotoGalery(photoGalleryTemp);
  }

  async function urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  function sharePhoto() {
    urltoFile(picture.dataUri, picture.title + '.png', "image/png")
      .then(function (file) {
        var fileUrl = URL.createObjectURL(file);
        alert("To share this photo with your friends, send this link:\n" + fileUrl);
      });
  }

  function deletePhotoFromGallery(e, photoId) {
    e.preventDefault();

    let photoGalleryTemp = getPhotoGalleryFromStorage();
    for (var i = 0; i < photoGalleryTemp.length; i++) {
      if (photoGalleryTemp[i].id === photoId) {
        photoGalleryTemp.splice(i, 1);
      }
    }

    persistPhotoGalery(photoGalleryTemp);
  }

  useEffect(() => {
    let photoGallery = getPhotoGalleryFromStorage();
    setPhotoGallery(photoGallery);
  }, []);

  return (
    <div className={classes.App}>
      <header className={classes.Header}>

        <h1>SlapSticker</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </nav>
        <p>
          Have you ever said something so dumb, you just wanted to slap
          yourself? Well now you can!
        </p>

      </header>
      <Switch>

        <Route path="/" exact>

          <main>
            <section className={classes.Gallery}>
              <p> Step 1: Give it a name </p>
              <input
                type="text"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </section>
            <section className={classes.Stickers}>
              <p> Step 2: select your sticker... </p>
              <button onClick={() => setSticker(stickers[0][0])}>
                <img src={stickers[0][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[1][0])}>
                <img src={stickers[1][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[2][0])}>
                <img src={stickers[2][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[3][0])}>
                <img src={stickers[3][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[4][0])}>
                <img src={stickers[4][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[5][0])}>
                <img src={stickers[5][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[6][0])}>
                <img src={stickers[6][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[7][0])}>
                <img src={stickers[7][0].url} alt="sticker" />
              </button>
              <button onClick={() => setSticker(stickers[8][0])}>
                <img src={stickers[8][0].url} alt="sticker" />
              </button>
            </section>
            <section className={classes.Main}>
              <p> Step 3: Slap your self! </p>
              <video ref={handleVideoRef} />
              <canvas
                ref={handleCanvasRef}
                width={2}
                height={2}
                onClick={handleCapture}
              />
            </section>
            <section className={classes.Gallery}>
              <p> Step 4: Share this moment forever </p>
              {picture && (
                <div className={classes.Picture}>
                  <img src={picture.dataUri} alt="" />
                  <h3>{picture.title}</h3>
                  <ul>
                    <li>
                      <a href="#" title="Save photo to gallery" onClick={savePhotoToGallery} enabled={enableSavePhoto}><svg id="Capa_1" enableBackground="new 0 0 512.007 512.007" height="20" viewBox="0 0 512.007 512.007" width="20" xmlns="http://www.w3.org/2000/svg"><g><path d="m511.927 126.537c-.279-2.828-1.38-5.666-3.315-8.027-.747-.913 6.893 6.786-114.006-114.113-2.882-2.882-6.794-4.395-10.612-4.394-9.096 0-329.933 0-338.995 0-24.813 0-45 20.187-45 45v422c0 24.813 20.187 45 45 45h422c24.813 0 45-20.187 45-45 .001-364.186.041-339.316-.072-340.466zm-166.927-96.534v98c0 8.271-6.729 15-15 15h-19v-113zm-64 0v113h-139c-8.271 0-15-6.729-15-15v-98zm64 291h-218v-19c0-8.271 6.729-15 15-15h188c8.271 0 15 6.729 15 15zm-218 161v-131h218v131zm355-15c0 8.271-6.729 15-15 15h-92c0-19.555 0-157.708 0-180 0-24.813-20.187-45-45-45h-188c-24.813 0-45 20.187-45 45v180h-52c-8.271 0-15-6.729-15-15v-422c0-8.271 6.729-15 15-15h52v98c0 24.813 20.187 45 45 45h188c24.813 0 45-20.187 45-45v-98h2.787l104.213 104.214z" fill="#fff" /></g></svg></a>
                      <a href="#" title="Share photo url" onClick={sharePhoto}><svg height="20" viewBox="0 0 512 512.00004" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m511.824219 255.863281-233.335938-255.863281v153.265625h-27.105469c-67.144531 0-130.273437 26.148437-177.753906 73.628906-47.480468 47.480469-73.628906 110.609375-73.628906 177.757813v107.347656l44.78125-49.066406c59.902344-65.628906 144.933594-103.59375 233.707031-104.457032v153.253907zm-481.820313 179.003907v-30.214844c0-59.132813 23.027344-114.730469 64.839844-156.542969s97.40625-64.839844 156.539062-64.839844h57.105469v-105.84375l162.734375 178.4375-162.734375 178.441407v-105.84375h-26.917969c-94.703124 0-185.773437 38.652343-251.566406 106.40625zm0 0" fill="#fff" /></svg></a>
                      <a href={picture.dataUri} download={picture.title} title="Download photo"><svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Solid" fill="#fff"><path d="m239.029 384.97a24 24 0 0 0 33.942 0l90.509-90.509a24 24 0 0 0 0-33.941 24 24 0 0 0 -33.941 0l-49.539 49.539v-262.059a24 24 0 0 0 -48 0v262.059l-49.539-49.539a24 24 0 0 0 -33.941 0 24 24 0 0 0 0 33.941z" /><path d="m464 232a24 24 0 0 0 -24 24v184h-368v-184a24 24 0 0 0 -48 0v192a40 40 0 0 0 40 40h384a40 40 0 0 0 40-40v-192a24 24 0 0 0 -24-24z" fill="#fff" /></g></svg></a>
                    </li>
                  </ul>
                </div>
              )}

            </section>
          </main>
        </Route>

        <Route path="/gallery">
          <div className={classes.SavedGallery}>
            <main>
              {photoGallery && photoGallery.length > 0
                ? (<ul>
                  {
                    photoGallery?.map((item) =>
                      <li>
                        <img src={item.dataUri} alt="" />
                        <a href="#" title="Delet Photo" onClick={(e) => deletePhotoFromGallery(e, item.id)}><svg height="20" viewBox="-57 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m156.371094 30.90625h85.570312v14.398438h30.902344v-16.414063c.003906-15.929687-12.949219-28.890625-28.871094-28.890625h-89.632812c-15.921875 0-28.875 12.960938-28.875 28.890625v16.414063h30.90625zm0 0" fill="#fff" /><path d="m344.210938 167.75h-290.109376c-7.949218 0-14.207031 6.78125-13.566406 14.707031l24.253906 299.90625c1.351563 16.742188 15.316407 29.636719 32.09375 29.636719h204.542969c16.777344 0 30.742188-12.894531 32.09375-29.640625l24.253907-299.902344c.644531-7.925781-5.613282-14.707031-13.5625-14.707031zm-219.863282 312.261719c-.324218.019531-.648437.03125-.96875.03125-8.101562 0-14.902344-6.308594-15.40625-14.503907l-15.199218-246.207031c-.523438-8.519531 5.957031-15.851562 14.472656-16.375 8.488281-.515625 15.851562 5.949219 16.375 14.472657l15.195312 246.207031c.527344 8.519531-5.953125 15.847656-14.46875 16.375zm90.433594-15.421875c0 8.53125-6.917969 15.449218-15.453125 15.449218s-15.453125-6.917968-15.453125-15.449218v-246.210938c0-8.535156 6.917969-15.453125 15.453125-15.453125 8.53125 0 15.453125 6.917969 15.453125 15.453125zm90.757812-245.300782-14.511718 246.207032c-.480469 8.210937-7.292969 14.542968-15.410156 14.542968-.304688 0-.613282-.007812-.921876-.023437-8.519531-.503906-15.019531-7.816406-14.515624-16.335937l14.507812-246.210938c.5-8.519531 7.789062-15.019531 16.332031-14.515625 8.519531.5 15.019531 7.816406 14.519531 16.335937zm0 0" fill="#fff" /><path d="m397.648438 120.0625-10.148438-30.421875c-2.675781-8.019531-10.183594-13.429687-18.640625-13.429687h-339.410156c-8.453125 0-15.964844 5.410156-18.636719 13.429687l-10.148438 30.421875c-1.957031 5.867188.589844 11.851562 5.34375 14.835938 1.9375 1.214843 4.230469 1.945312 6.75 1.945312h372.796876c2.519531 0 4.816406-.730469 6.75-1.949219 4.753906-2.984375 7.300781-8.96875 5.34375-14.832031zm0 0" fill="#fff" /></svg></a>
                      </li>
                    )}
                </ul>)
                : (<span>You don't have any photos in your gallery! Start slapping!</span>)
              }
            </main>
          </div>
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
