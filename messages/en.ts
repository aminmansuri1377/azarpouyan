import { email } from "zod";

const en = {
  siteName: "KGA Commerce",

  welcome: "Welcome to our store",

  categories: "Categories",

  blogs: "Blog",

  news: "News",
  home: "Home",
  products: "Products",
  consulting: "consulting",
  aboutUs: "About Us",
  changeLanguage: "Change Language",
  baseServices: "Our main services :",
  likeConversation:
    "We always love to talk to customers, potential customers, business analysts, and digital freight enthusiasts. To save your time, before contacting us, check if the links below can be helpful or not.",
  hero: {
    brand: "kgacommerce",
    tagline: "smart trading with instant access to global markets",
    description:
      "We are an international trading company that provides industrial goods supply and access to real-time global market data together. Our goal is to simplify the process of purchasing, supplying, and decision-making in global trade.",
    year: "2026",
    receiveConsulting: "Receive Consulting",
    seeServices: "See Services",
    ourStory: "Our Story",
    ourStoryDescription:
      "We are an international trading company that provides industrial goods supply and access to real-time global market data together. Our goal is to simplify the process of purchasing, supplying, and decision-making in global trade.",
    usersLabel: "active users",
  },

  footer: "All rights reserved",
  contactus: "contact Us",
  nameandSurname: "Name and Surname",
  companyName: "Company Name",
  email: "Email",
  phoneNumber: "Phone Number",
  subject: "Subject",
  message: "Message",
  ConsultationRequestForm: "Consultation Request Form",
  contactInfo: "Contact Info :",
  startBusiness: "Start Business",
  notif: {
    adminConfigMissing: "Admin login configuration is missing",
    passwordRequired: "Please enter your password",
    invalidPassword: "The password you entered is incorrect",
    adminLoginFailed: "Failed to log in to the admin panel",

    categoryHasProducts:
      "This category (or one of its subcategories) contains products and cannot be deleted",

    categoryCannotUseChildAsParent:
      "A child category cannot be selected as the parent category",

    categoryCannotBeOwnChild: "A category cannot be assigned as its own child",

    contactRequestNotFound: "Contact request not found",
    contactRequestsFetchFailed: "Failed to retrieve contact requests",
    contactRequestCreateFailed: "Failed to create contact request",

    languageDeletedSuccessfully: "Language deleted successfully",
    languageUpdatedSuccessfully: "Language updated successfully",
    languageCreatedSuccessfully: "Language created successfully",

    priceTickerCreateFailed: "Failed to create price ticker",
    itemNotFound: "Requested item was not found",
    priceTickerUpdateFailed: "Failed to update price ticker",
    priceTickerDeleteFailed: "Failed to delete price ticker",

    productCreateFailed: "Failed to create product",
    productUpdateFailed: "Failed to update product",
    productDeleteNotAllowed: "Product cannot be deleted",

    fetchFailed: "Failed to fetch data",

    blogNotFound: "Blog not found",
    notFound: "Not Found",

    contactMessageSentSuccessfully: "Your message has been sent successfully",
    contactMessageSendFailed: "Failed to send message",

    contentDeletedSuccessfully: "Content deleted successfully",
    contentDeleteFailed: "Failed to delete content",
    PleaseCompleteFormErrors: "Please correct the form errors",
  },
};

export default en;
