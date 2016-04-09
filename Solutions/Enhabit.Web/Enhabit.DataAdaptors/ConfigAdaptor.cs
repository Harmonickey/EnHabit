﻿using System;
using System.Configuration;

using Enhabit.Presenter.DataAdaptors;

namespace Enhabit.Adaptors
{
    public class ConfigAdaptor : IConfigAdaptor
    {
        public string EnhabitConnectionString
        {
            get
            {
                return ReadConnectionSetting("EnhabitConnectionString");
            }
        }

        public string DefaultListingImage
        {
            get
            {
                return ReadAppSetting("DefaultListingPicture");
            }
        }

        public string CloudinaryCloudName
        {
            get
            {
                return ReadAppSetting("CloudinaryCloudName");
            }
        }

        public string CloudinaryApiKey
        {
            get
            {
                return ReadAppSetting("CloudinaryApiKey");
            }
        }

        public string CloudinaryApiSecret
        {
            get
            {
                return ReadAppSetting("CloudinaryApiSecret");
            }
        }

        private static string ReadConnectionSetting(string connStringKey)
        {
            var config = ConfigurationManager.ConnectionStrings[connStringKey];

            if (config == null || String.IsNullOrEmpty(config.ConnectionString))
            {
                throw new ConfigurationErrorsException(String.Format("Missing {0} connection string from machine or web config", connStringKey));
            }

            return config.ConnectionString;
        }

        private static string ReadAppSetting(string key)
        {
            string value;

            try
            {
                value = ConfigurationManager.AppSettings[key];

                if (string.IsNullOrEmpty(value))
                {
                    throw new ArgumentNullException(key);
                }
            }
            catch
            {
                throw new ArgumentException(string.Format("Missing or invalid configuration value in web/app config file for key : {0}", key));
            }

            return value;
        }

    }
}