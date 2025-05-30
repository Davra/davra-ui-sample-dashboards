"use strict";

/******************************************************************************
 This is a simple express js microservice which serves-out static content from 
 the public subfolder. All static content be they html files, images etc should
 be placed in public or subfolders for the public dir
 e.g. a common structure looks as follows:
 public
      |_ index.html
      |_ css
           |_style.css
      |_ imgs
           |_ logo.png
      |_ js
          |_ index.js
*/

import express from  'express';
import session from "express-session"
import passport from "passport"
import OAuth2 from "passport-oauth2"
import axios from "axios"
const OAuth2Strategy = OAuth2.Strategy;

const BASE_URL = "https://tls.davra.com";
const callbackURL = "http://localhost:8080/callback";
const clientID = "eYH2zdHDguBljmyozIqD";
const clientSecret = "5VOUnjpRWHfbqNjP7U7jlDMHMggcQNt3yHYAqip4";
const defaultSessionLength = 1000 * 60 * 60 * 24 * 7; // 1 week
const TARGET_HOST = "skeleton-app-2-tls.apps.eu.davra.com";

const prodConfig = {
    authorizationURL: BASE_URL + '/oauth/authorize',
    tokenURL: BASE_URL + '/oauth/token',
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    passReqToCallback: true
  };

  
  const TENANT_HOST = 'tls.davra.com';
  const SERVER_PORT = 8080;
  const app = express();
  
  const sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave: true,
  saveUninitialized: true
  };
  app.use(session(sess));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });
  
  const pp = passport.initialize();
  app.use(pp);
  const ppSession = passport.session();
  app.use(ppSession);
  
  passport.serializeUser((user, cb) => {
    cb(null, JSON.stringify(user));
  });
  
  passport.deserializeUser((userSz, cb) => {
    if (!userSz) {
      return cb();
    }
    if (typeof userSz === "object") {
      return cb(null, userSz);
    }
    try {
      const userObj = JSON.parse(userSz);
      cb(null, userObj);
    } catch (err) {
      cb(err);
    }
  });
  

  
  /**
   * Enable on live
   */
  const ensureTargetHost = (req, res, next) => {
    if (req.hostname !== TARGET_HOST) {
      res.redirect(301, "https://" + TARGET_HOST + req.url);
    } else {
      next();
    }
  };
  
  app.use(ensureTargetHost);
  
  passport.use(
    new OAuth2Strategy(
      prodConfig,
      (req, accessToken, refreshToken, profile, cb) => {
        console.log("🚀 ~ accessToken, refreshToken:", accessToken, refreshToken)
        console.log("Got token from Davra Platform");
        if (req.session) {
          req.session.oauth = { accessToken, refreshToken };
        }
        console.log("🚀 ~  req.session.oauth:",  req.session.oauth)
        cb(null, { id: profile.UUID });
      }
    )
  );
  
  
  app.get("/login", passport.authenticate("oauth2"), (req, res) => {
    res.redirect("/");
  });
  
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  
  app.get(
    "/callback",
    passport.authenticate("oauth2", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect home.
      console.log("Callback...got token from Davra Platform");
      res.redirect("/");
    }
  );
  
  app.get("/user", (req, res) => {
    // Successful authentication, redirect home.
    if (!req.user) {
      res.redirect("/");
      return;
    }
    axios.get(
      `https://${TENANT_HOST}/user`,
      {
        json: true,
        headers: {
          "User-Agent": req.headers["user-agent"],
          Authorization: `Bearer ${req.session.oauth.accessToken}`,
        },
      },
      (err, response, body) => {
        if (err) {
          res.writeHead(500);
          res.write(err);
          res.end();
        } else if (response.statusCode !== 200) {
          res.writeHead(response.statusCode);
          res.write(body);
          res.end();
        } else {
          // save use response to passport session:
          req.session.passport.user = JSON.stringify(body);
          // write response to front end:
          res.writeHead(200, { "content-type": "application/json" });
          body.oauth = req.session.oauth;
          res.write(JSON.stringify(body));
          res.end();
        }
      }
    );
  });
  
  
  app.use(express.json());
  const staticMW = express.static("dist");
  app.get(
    "/",
    (req, res, next) => {
      if (!req.user) {
        res.redirect("/login");
      } else {
        next();
      }
    },
    staticMW
  );
  
  app.use(staticMW);
  
  
  app.listen(SERVER_PORT, function () {
    console.log(
      "davra.com node microservice listening on port " + SERVER_PORT + "!"
    );
  });