import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import {
    RiDeleteBin7Line as TrashIcon,
    RiEqualizerLine as SettingsIcon,
    RiFileTextLine as DocumentIcon,
    RiHome2Line as HomeIcon,
    RiQuestionLine as HelpIcon,
    RiSearchLine as SearchIcon,
    RiShareLine as ShareIcon
} from "react-icons/ri"
import Flex from "src/components/Flex"
import Separator from "src/components/Separator"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useGetDocumentsQuery } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { useAppDispatch, useAppSelector } from "src/store"
import { closeMobileSidebar, openQuicksearch } from "src/store/ui"
import { useUser } from "src/utils/supabase"
import styled, { css } from "styled-components"

import AccountSection from "./components/AccountSection"
import AddFolderButton from "./components/AddFolderButton"
import Outliner from "./components/Outliner"
import SidebarItem from "./components/SidebarItem"

export default function Sidebar() {
    const router = useRouter()
    const user = useUser()

    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (store) => store.ui
    )
    const { activeDocumentId } = useAppSelector((store) => store.navigation)

    const dispatch = useAppDispatch()

    const {
        data: folders,
        error: foldersError,
        isLoading: isLoadingFolders
    } = useGetFoldersQuery(null)

    const {
        data: documents,
        error: documentsError,
        isLoading: isLoadingDocuments
    } = useGetDocumentsQuery(null)

    const favorites = useMemo(
        () => documents?.filter((d) => d.favorite),
        [documents]
    )

    useEffect(() => {
        dispatch(closeMobileSidebar())
    }, [router.asPath, dispatch])

    return (
        <>
            <Backdrop
                onClick={() => dispatch(closeMobileSidebar())}
                visible={mobileSidebarOpen}
            />
            <SidebarComponent
                column
                open={sidebarOpen}
                mobileOpen={mobileSidebarOpen}
                className="sidebar"
            >
                <AccountSection user={user} />
                <Section>
                    <SidebarItem.Link
                        icon={<HomeIcon />}
                        title="Accueil"
                        href="/home"
                    />
                    <SidebarItem.Link
                        icon={<ShareIcon />}
                        title="Partages"
                        href="/shares"
                    />
                    <SidebarItem.Button
                        icon={<SearchIcon />}
                        title="Rechercher"
                        onClick={() => {
                            dispatch(openQuicksearch())
                        }}
                    />
                </Section>
                <Separator />
                <Section
                    style={{
                        flex: "1 1 auto",
                        flexShrink: "initial",
                        overflow: "auto",
                        gap: 20
                    }}
                >
                    {!!favorites?.length && (
                        <Flex column gap={2} style={{ flexShrink: 0 }}>
                            <SectionTitle>
                                Favoris <Badge>{favorites?.length}</Badge>
                            </SectionTitle>
                            {favorites.map(({ id, title }) => (
                                <SidebarItem.Link
                                    key={id}
                                    href={`/doc/${id}`}
                                    icon={<DocumentIcon />}
                                    title={title}
                                    active={id === activeDocumentId}
                                />
                            ))}
                        </Flex>
                    )}

                    <Flex auto column gap={2}>
                        <SectionTitle>
                            Dossiers <Badge>{folders?.length}</Badge>
                        </SectionTitle>
                        {(isLoadingFolders || isLoadingDocuments) && <Loader />}
                        {(foldersError || documentsError) && (
                            <Typography.Text type="danger">
                                Une erreur est survenue. Voir la console.
                            </Typography.Text>
                        )}
                        {folders && documents && (
                            <Outliner folders={folders} documents={documents} />
                        )}
                        <AddFolderButton />
                    </Flex>
                </Section>
                <Separator />
                <Section>
                    <SidebarItem.Link
                        icon={<TrashIcon />}
                        title="Corbeille"
                        href="/trash"
                    />
                    <SidebarItem.Link
                        icon={<SettingsIcon />}
                        title="Paramètres"
                        href="/settings"
                    />
                    <SidebarItem.Link
                        icon={<HelpIcon />}
                        title="Aide"
                        href="/help"
                    />
                </Section>
            </SidebarComponent>
        </>
    )
}

const Backdrop = styled.div<{ visible: boolean }>`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: absolute;
        inset: 0;
        z-index: 25;
        background: var(--color-black);
        pointer-events: none;
        opacity: 0;
        ${({ visible }) =>
            visible &&
            css`
                opacity: 0.75;
                pointer-events: all;
            `}
        transition: all ease-out 0.2s;
    }
`

const SidebarComponent = styled(Flex)<{ open: boolean; mobileOpen: boolean }>`
    position: relative;
    max-height: 100vh;
    min-width: 300px;
    border-right: 1px solid var(--color-n300);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: auto;

    background-color: var(--color-white);
    margin-left: ${({ open }) => `${open ? 0 : -300}px`};
    transition: all ease-out 0.25s;
    z-index: 25;

    @media (max-width: 768px) {
        position: absolute;
        top: 0;
        bottom: 0;
        margin-left: 0;
        opacity: ${({ mobileOpen }) => (mobileOpen ? 1 : 0)};
        transform: ${({ mobileOpen }) =>
            mobileOpen ? "translateX(0)" : "translateX(-100%)"};
    }
`

const Section = styled.div`
    display: flex;
    gap: 2px;
    padding: 16px 20px;
    flex-direction: column;
    flex-shrink: 0;
`

const SectionTitle = styled.h3`
    font-size: 0.9em;
    font-weight: 500;
    margin: 0 0 5px 0;
    color: var(--color-n500);
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
`

const Badge = styled.span`
    background-color: var(--color-n100);
    padding: 5px;
    font-size: 0.8em;
    font-weight: 600;
    color: var(--color-n700);
    border-radius: 5px;
    font-family: "JetBrains Mono", monospace;
`
