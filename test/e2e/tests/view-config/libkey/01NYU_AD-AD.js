const testCases = [
    // === General searches: potential risk of false positives due to search ranking volatility

    {
        name        : 'Art [advanced search: Material Type = Articles]',
        queryString : 'query=any,contains,art,AND&pfilter=rtype,exact,articles,AND&tab=default_slot&search_scope=CI_NYUAD_NYU&mode=advanced&offset=0',
    },
    {
        name                               : 'Art [advanced search: Material Type = Articles]',
        queryString                        : 'query=any,contains,art,AND&pfilter=rtype,exact,articles,AND&tab=default_slot&search_scope=CI_NYUAD_NYU&mode=advanced&offset=0',
        browzinePrimoAdapterExecutionDelay : 10_000,
    },

    // === Targeted `docid` searches: not subject to search ranking volatility
    //
    // The test cases below are targeted `docid` searches provided by KARMS DAI.
    // DAI determined that based on their permalink history, these records are
    // likely to be stable over time with regard to inclusion of LibKey links.

    {
        name        : 'docid: cdi_crossref_primary_10_1080_14672715_2021_1888307',
        queryString : 'query=any,contains,cdi_crossref_primary_10_1080_14672715_2021_1888307&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
    },
    {
        name        : 'docid: cdi_informaworld_taylorfrancis_310_1080_15596893_2022_2116781',
        queryString : 'query=any,contains,cdi_informaworld_taylorfrancis_310_1080_15596893_2022_2116781&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
    },
    {
        name        : 'docid: cdi_proquest_journals_2358492548',
        queryString : 'query=any,contains,cdi_proquest_journals_2358492548&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
    },
    {
        name        : 'docid: cdi_cleo_primary_oai_revues_org_chinaperspectives_7327',
        queryString : 'query=any,contains,cdi_cleo_primary_oai_revues_org_chinaperspectives_7327&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
    },
];

export {
    testCases,
};
