namespace Enhabit.Presenter.DataAdaptors
{
    public interface IConfigAdaptor
    {
        string EnhabitConnectionString { get; }

        string DefaultListingImage { get; }

        string CloudinaryCloudName { get; }

        string CloudinaryApiKey { get; }

        string CloudinaryApiSecret { get; }
    }
}
