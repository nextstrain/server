import React from "react";
import Helmet from "react-helmet";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";
import config from "../../data/SiteConfig";
import NavBar from "../components/nav-bar";
import MainLayout from "../components/layout";
import UserDataWrapper from "../layouts/userDataWrapper";
import {
  SmallSpacer,
  MediumSpacer,
  HugeSpacer,
  FlexCenter,
} from "../layouts/generalComponents";
import * as splashStyles from "../components/splash/styles";
import Footer from "../components/Footer";
import TOC from "../components/build-pages/toc";
import DatasetSelect from "../components/build-pages/dataset-select";

const title = "Influenza resources";
const abstract = `The Nextstrain team maintains datasets and other tools for analyzing a variety of influenza viruses.
We track the evolution of seasonal influenza viruses (A/H3N2, A/H1N1pdm, B/Victoria, and B/Yamagata)
and use these analyses to inform recommendations for the World Health Organization’s influenza vaccine composition meetings.
We also maintain datasets for a subset of avian influenza viruses that have caused recurrent outbreaks in humans
and domestic birds, including novel reassortant H5 viruses.`;

const contents = [
  {
    type: "external",
    to: "/flu/seasonal/h3n2/ha/2y",
    title: "Latest A/H3N2 analysis",
    subtext: (
      <span>
        Jump to our latest A/H3N2 seasonal influenza build which is updated weekly. We also maintain builds for:
        <br/><a href="/flu/seasonal/h1n1pdm/ha/2y"> A/H1N1pdm</a>
        <br/><a href="/flu/seasonal/vic/ha/2y"> B/Vic</a>
        <br/><a href="/flu/seasonal/yam/ha/2y"> B/Yam</a>
        <br/><a href="/flu/avian/h5n1/ha"> A/H5N1 (Avian)</a>
        <br/><a href="/flu/avian/h5nx/ha"> A/H5NX (Avian)</a>
        <br/><a href="/flu/avian/h7n9/ha"> A/H7N9 (Avian)</a>
        <br/><a href="/flu/avian/h9n2/ha"> A/H9N2 (Avian)</a>
      </span>
    )
  },
  {
    type: "anchor",
    to: "builds",
    title: "Scroll down to all available builds (datasets)"
  },
  {
    type: "gatsby",
    to: "/search/seasonal-flu",
    title: "Search seasonal flu builds by strain name(s)",
    subtext: "Search all seasonal influenza nextstrain builds, including historical ones, for particular strain name(s)",
  }
];


class Index extends React.Component {
  constructor(props) {
    super(props);
    configureAnchors({ offset: -10 });
    this.state = {
      dataLoaded: false,
      errorFetchingData: false,
      datasetsUrl: "https://data.nextstrain.org/datasets_influenza.json"
    };
  }

  async componentDidMount() {
    try {
      const datasets = await fetchAndParseDatasetsJSON(this.state.datasetsUrl);
      this.setState({datasets, dataLoaded: true});
    } catch (err) {
      console.error("Error fetching / parsing data.", err.message);
      this.setState({errorFetchingData: true});
    }
  }

  render() {
    return (
      <MainLayout>
        <div className="index-container">
          <Helmet title={config.siteTitle} />
          <main>
            <UserDataWrapper>
              <NavBar location={this.props.location} />
            </UserDataWrapper>

            <splashStyles.Container className="container">
              <HugeSpacer /><HugeSpacer />
              <splashStyles.H1>{title}</splashStyles.H1>
              <SmallSpacer />

              <FlexCenter>
                <splashStyles.CenteredFocusParagraph>
                  {abstract}
                </splashStyles.CenteredFocusParagraph>
              </FlexCenter>
              <MediumSpacer />

              <TOC data={contents} />

              <ScrollableAnchor id={"builds"}>
                <div>
                  <HugeSpacer /><HugeSpacer />
                  <splashStyles.H2 left>
                    Influenza builds
                  </splashStyles.H2>
                  <SmallSpacer />
                  <splashStyles.FocusParagraph>
                    This section is an index of public Nextstrain builds (datasets) for flu, organized by type.
                    See <a href="https://docs.nextstrain.org/projects/augur/en/stable/faq/what-is-a-build.html" >here</a> for more information on what a build is.
                    If you know of a build not listed here, please let us know!
                    Please note that inclusion on this list does not indicate an endorsement by the Nextstrain team.
                  </splashStyles.FocusParagraph>
                  <div className="row">
                    <MediumSpacer />
                    <div className="col-md-1"/>
                    <div className="col-md-10">
                      {this.state.dataLoaded &&
                      <DatasetSelect datasets={this.state.datasets} />}
                    </div>
                  </div>
                  { this.state.errorFetchingData && <splashStyles.CenteredFocusParagraph>
                              Something went wrong getting data.
                              Please <a href="mailto:hello@nextstrain.org">contact us at hello@nextstrain.org </a>
                              if this continues to happen.</splashStyles.CenteredFocusParagraph>}
                </div>
              </ScrollableAnchor>

              <Footer />
            </splashStyles.Container>
          </main>
        </div>
      </MainLayout>
    );
  }
}

// scripts/collect-datasets.js lists flu datasets from s3 into a JSON
// which is pushed on a regular basis back to s3 to be fetched here
// for the flu datasets page. This way of doing things is subject to change.
async function fetchAndParseDatasetsJSON(jsonUrl) {
  const datasetsJSON = await fetch(jsonUrl)
    .then((res) => res.text())
    .then((text) => JSON.parse(text));
  return datasetsJSON;
}

export default Index;
