import { ChevronRight } from "@mui/icons-material"
import { ButtonBase, Card, CircularProgress, Toolbar } from "@mui/material"
import clsx from "clsx"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { Link, Outlet, useMatch } from "react-router-dom"
import { EmptyStateCard } from "../../components/Card"
import { withSuspensible } from "../../utils/suspensible"
import { ResearchIndexPageQuery } from "./__generated__/ResearchIndexPageQuery.graphql"

export const ResearchIndexPage = withSuspensible(() => {
  const matches = useMatch("/research/:id")
  const data = useLazyLoadQuery<ResearchIndexPageQuery>(
    graphql`
      query ResearchIndexPageQuery {
        researches {
          edges {
            node {
              id
              name
            }
          }
        }

        me {
          name
        }
      }
    `,
    {},
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Hi, {data.me?.name}</h1>
      <h2 className="text-lg">正在进行的 RogueStats 课题</h2>

      <div className="flex items-start gap-4">
        <div className="w-48 flex flex-col gap-2">
          {data.researches.edges.map(({ node: research }) => (
            <Link
              to={`/research/${research.id}`}
              key={research.id}
              className={clsx(
                matches?.params.id === research.id && "cursor-default",
              )}
            >
              <ButtonBase
                key={research.id}
                color="transparent"
                className="shadow-lg w-full"
                disabled={matches?.params.id === research.id}
              >
                <Card
                  className={clsx(
                    "h-full w-full p-4 text-left flex transition",
                    matches?.params.id === research.id &&
                      "bg-slate-900 text-white",
                  )}
                >
                  <div>{research.name}</div>

                  {matches?.params.id === research.id && (
                    <ChevronRight className="ml-auto" />
                  )}
                </Card>
              </ButtonBase>
            </Link>
          ))}
        </div>

        <div className="flex-1">
          <Suspense
            fallback={
              <EmptyStateCard>
                <Toolbar className="absolute left-0 right-0 top-0 bg-slate-900 text-white py-4 opacity-10 select-none">
                  <div className="flex flex-col">
                    <h4 className="text-sm leading-none mb-1.5">汇报</h4>
                    <h1 className="text-xl leading-none font-bold">
                      加载中...
                    </h1>
                  </div>
                </Toolbar>

                <CircularProgress />
              </EmptyStateCard>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
})
