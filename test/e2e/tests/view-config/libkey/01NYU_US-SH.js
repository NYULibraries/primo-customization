const testCases = [
    // === General searches: potential risk of false positives due to search ranking volatility

    {
        name         : 'Art [advanced search: Material Type = Articles]',
        pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,art,AND&pfilter=rtype,exact,articles,AND&tab=default_slot&search_scope=CI_NYUSH_NYU&mode=advanced&offset=0',
    },
    {
        name                               : 'Art [advanced search: Material Type = Articles]',
        pathAndQuery                       : '/discovery/search?vid=[VID]&query=any,contains,art,AND&pfilter=rtype,exact,articles,AND&tab=default_slot&search_scope=CI_NYUSH_NYU&mode=advanced&offset=0',
        browzinePrimoAdapterExecutionDelay : 10_000,
    },

    // === Targeted `docid` searches: not subject to search ranking volatility
    //
    // The test cases below are targeted `docid` searches provided by KARMS DAI.
    // DAI determined that based on their permalink history, these records are
    // likely to be stable over time with regard to inclusion of LibKey links.

    {
        name         : 'docid: cdi_crossref_primary_10_1080_14672715_2021_1888307',
        pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,cdi_crossref_primary_10_1080_14672715_2021_1888307&tab=default_slot&search_scope=CI_NYUSH_NYU&offset=0',
    },
    {
        name         : 'docid: cdi_informaworld_taylorfrancis_310_1080_15596893_2022_2116781',
        pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,cdi_informaworld_taylorfrancis_310_1080_15596893_2022_2116781&tab=default_slot&search_scope=CI_NYUSH_NYU&offset=0',
    },
    {
        name         : 'docid: cdi_proquest_journals_2358492548',
        pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,cdi_proquest_journals_2358492548&tab=default_slot&search_scope=CI_NYUSH_NYU&offset=0',
    },
    // Temporarily disabling this failing "Download via Unpaywall" test case.
    // KARMS DAI is investigating its disappearance.  It's possible that the
    // docid is a casualty of a recent CDI "disruption" that resulted in mass
    // data loss.  Ex Libris is still in the process of restoring all the data.
    // For details, see Primo email list thread:
    // "Update: CDI details"
    // https://exlibrisusers.org/hyperkitty/list/primo@exlibrisusers.org/thread/5MU2TN37MQXBV3EE3GQLDJH5K7OTG5VR/
    // {
    //     name         : 'docid: cdi_cleo_primary_oai_revues_org_chinaperspectives_7327',
    //     pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,cdi_cleo_primary_oai_revues_org_chinaperspectives_7327&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
    // },
];

export {
    testCases,
};

