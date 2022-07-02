export const selectors = {
    main: {
        listUl: 'main ul',
        listItemRef: 'li .mb1 a',
        profileImg: '.pv-top-card-profile-picture__image',
        contactInfoA: '#top-card-text-details-contact-info',
        contacInfoS: '.section-info',
        generalContainer: idRef => `#${idRef} ~ .pvs-list__outer-container > ul >li >div`
    }
};