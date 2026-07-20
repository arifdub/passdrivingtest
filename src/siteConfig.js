/*
  ===========================================================================
  SITE CONFIG — edit THIS file for small changes.
  You don't need to touch App.jsx for any of the items below.

  After saving a change here (and pushing it to GitHub), your live site
  updates automatically within about a minute.
  ===========================================================================
*/

const SITE_CONFIG = {
  // Shown in the footer and mobile menu, and used for the "tap to call" link.
  phoneDisplay: "086 206 5942",
  phoneTel: "+353862065942", // same number, no spaces, country code instead of the leading 0

  // Used for the sticky WhatsApp button (same number, no + or spaces).
  whatsappNumber: "353862065942",

  email: "hello@passdrivingtest.ie",
  address: "Dublin, Ireland",

  // The three options shown on the "Book a Lesson" page.
  // Change the label, duration or price text freely — just keep the id the same.
  lessons: [
    { id: "1hr", label: "1-Hour Lesson", duration: "60 min", price: "\u20ac50" },
    { id: "2hr", label: "2-Hour Lesson", duration: "120 min", price: "\u20ac100" },
    { id: "pretest", label: "Pre-Test Lesson", duration: "60 min", price: "\u20ac120" },
  ],
};

export default SITE_CONFIG;
